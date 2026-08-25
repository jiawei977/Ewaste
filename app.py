import os
import uuid
import math
import requests
from dotenv import load_dotenv
from flask import Flask, request, session, jsonify, abort, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import safe_join, secure_filename
from ultralytics import YOLO
from PIL import Image, ImageOps, UnidentifiedImageError
import imagehash
from urllib.parse import urlencode
import mysql.connector

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIST = os.path.join(BASE_DIR, 'frontend', 'dist')
AVATAR_FOLDER = os.path.join(BASE_DIR, 'static', 'avatars')
MAX_AVATAR_UPLOAD_SIZE = 5 * 1024 * 1024
load_dotenv(os.path.join(BASE_DIR, '.env'))

# MySQL database configuration
def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='',
        database='ewaste_db'
    )

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'change_this_secret')
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['DUPLICATE_HASH_DISTANCE'] = 3


# 2. Load the YOLO Model (Loads once when server starts)
model = YOLO('best.pt') 

def get_ewaste_news():
    """Fetches latest e-waste and recycling news from NewsData.io."""
    api_key = os.environ.get('NEWSDATA_API_KEY')
    if not api_key:
        print('News API is disabled: NEWSDATA_API_KEY is not configured.')
        return []

    # We broadened the query to 'e-waste OR recycling' and removed the strict category for more results
    url = 'https://newsdata.io/api/1/news'
    try:
        response = requests.get(
            url,
            params={
                'apikey': api_key,
                'q': 'e-waste',
                'language': 'en,ms',
                'removeduplicate': 1,
            },
            timeout=5,
        )
        if response.status_code == 200:
            data = response.json()
            results = data.get('results', [])
            # Map NewsData fields to the naming convention used in the index.html template
            transformed_news = []
            for item in results:
                # Simplified extraction - removing the redundant local filter
                transformed_news.append({
                    'title': item.get('title', 'No Title Available'),
                    'description': item.get('description'),
                    'url': item.get('link'),
                    'urlToImage': item.get('image_url'),
                    'source': {'name': item.get('source_id', 'Sustainability News').replace('_', ' ').title()}
                })
                
                # Limit to 3 articles 
                if len(transformed_news) == 3:
                    break
            return transformed_news
        else:
            print(f"News API Error: Status {response.status_code} - {response.text}")
    except Exception as e:
        print(f"News API Connection Error: {e}")
        return []
    return []

def fetch_guideline(class_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT category, recycling_instruction, points FROM recycling_guidelines WHERE class_index = %s "
    cursor.execute(query, (class_id,))

    result = cursor.fetchone()
    cursor.close()
    conn.close()

    return result

def generate_image_hash(image_path):
    with Image.open(image_path) as uploaded_image:
        normalized_image = ImageOps.exif_transpose(uploaded_image).convert('RGB')
        return str(imagehash.phash(normalized_image))


def find_duplicate_image(user_id, candidate_hash):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT id, image_hash
        FROM recycle_history
        WHERE user_id = %s AND image_hash IS NOT NULL
        ORDER BY timestamp DESC
        """,
        (user_id,),
    )
    records = cursor.fetchall()
    cursor.close()
    conn.close()

    candidate = imagehash.hex_to_hash(candidate_hash)
    for record in records:
        try:
            distance = candidate - imagehash.hex_to_hash(record['image_hash'])
        except (TypeError, ValueError):
            continue
        if distance <= app.config['DUPLICATE_HASH_DISTANCE']:
            return {'history_id': record['id'], 'distance': distance}
    return None


def record_recycle_history(user_id, category, points, image_hash):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "INSERT INTO recycle_history (user_id, item_type, points, image_hash) VALUES (%s, %s, %s, %s)"
    cursor.execute(query, (user_id, category, points, image_hash))
    conn.commit()
    cursor.close()
    conn.close()


def find_user_by_email(email):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT user_id, username, email, password, avatar_url FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user


def find_user_by_username(username):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT user_id, username, email, password, avatar_url FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user


def find_user_for_login(identifier):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT user_id, username, email, password, avatar_url
        FROM users
        WHERE email = %s OR username = %s
        ORDER BY CASE WHEN email = %s THEN 0 ELSE 1 END
        LIMIT 1
        """,
        (identifier, identifier, identifier),
    )
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user


def find_user_by_id(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT u.user_id, u.username, u.email, u.avatar_url,
               p.full_name, p.bio, p.gender, p.address, p.city, p.state,
               p.postcode, p.location_enabled, p.preferred_language, p.theme
        FROM users u
        LEFT JOIN user_profiles p ON p.user_id = u.user_id
        WHERE u.user_id = %s
        """,
        (user_id,),
    )
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user


def public_user(user):
    return {
        'user_id': user['user_id'],
        'username': user['username'],
        'avatar_url': user.get('avatar_url'),
        'theme': 'dark' if user.get('theme') == 'dark' else 'light',
    }


def profile_user(user):
    return {
        **public_user(user),
        'email': user['email'],
        'full_name': user.get('full_name') or '',
        'bio': user.get('bio') or '',
        'gender': user.get('gender') or '',
        'address': user.get('address') or '',
        'city': user.get('city') or '',
        'state': user.get('state') or '',
        'postcode': user.get('postcode') or '',
    }


def create_user(username, email, password):
    password_hash = generate_password_hash(password)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
        (username, email, password_hash)
    )
    conn.commit()
    cursor.close()
    conn.close()


def get_global_monthly_total():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT COUNT(*) as total 
        FROM recycle_history 
        WHERE MONTH(timestamp) = MONTH(CURRENT_DATE()) 
        AND YEAR(timestamp) = YEAR(CURRENT_DATE())
    """
    cursor.execute(query)
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    return result['total'] if result else 0


@app.route('/api/health')
def api_health():
    return jsonify(status='ok', service='ewaste-flask-api')


@app.route('/api/auth/session')
def api_auth_session():
    if 'user_id' not in session:
        return jsonify(authenticated=False, user=None)

    user = find_user_by_id(session['user_id'])
    if user is None:
        session.clear()
        return jsonify(authenticated=False, user=None)

    return jsonify(authenticated=True, user=public_user(user))


@app.route('/api/auth/register', methods=['POST'])
def api_register():
    payload = request.get_json(silent=True) or {}
    username = str(payload.get('username', '')).strip()
    email = str(payload.get('email', '')).strip()
    password = str(payload.get('password', ''))
    confirm_password = str(payload.get('confirm_password', ''))

    if not username or not email or not password or not confirm_password:
        return jsonify(error='Please fill in all fields.'), 400
    if password != confirm_password:
        return jsonify(error='Passwords do not match.'), 400
    if find_user_by_email(email):
        return jsonify(error='Email is already registered.'), 409
    if find_user_by_username(username):
        return jsonify(error='Username is already taken.'), 409

    create_user(username, email, password)
    return jsonify(message='Account created successfully. You can now sign in.'), 201


@app.route('/api/auth/login', methods=['POST'])
def api_login():
    payload = request.get_json(silent=True) or {}
    identifier = str(payload.get('identifier', payload.get('email', ''))).strip()
    password = str(payload.get('password', ''))
    user = find_user_for_login(identifier) if identifier and password else None

    if user is None or not check_password_hash(user['password'], password):
        return jsonify(error='Invalid username, email, or password.'), 401

    session.clear()
    session['user_id'] = user['user_id']
    session['username'] = user['username']
    return jsonify(
        message='Signed in successfully.',
        user=public_user(find_user_by_id(user['user_id'])),
    )


@app.route('/api/auth/logout', methods=['POST'])
def api_logout():
    session.clear()
    return jsonify(message='Signed out successfully.')


@app.route('/api/profile/avatar', methods=['POST'])
def api_upload_avatar():
    if 'user_id' not in session:
        return jsonify(error='Authentication required.'), 401

    if request.content_length and request.content_length > MAX_AVATAR_UPLOAD_SIZE:
        return jsonify(error='Avatar image must be 5 MB or smaller.'), 413

    uploaded_file = request.files.get('avatar')
    if uploaded_file is None or not uploaded_file.filename:
        return jsonify(error='Please choose an avatar image.'), 400

    try:
        with Image.open(uploaded_file.stream) as source_image:
            if source_image.format not in {'JPEG', 'PNG', 'WEBP'}:
                return jsonify(error='Please upload a valid JPEG, PNG, or WebP image.'), 400
            source_image.verify()
        uploaded_file.stream.seek(0)
        with Image.open(uploaded_file.stream) as source_image:
            normalized_image = ImageOps.exif_transpose(source_image).convert('RGB')
            avatar_image = ImageOps.fit(
                normalized_image,
                (512, 512),
                method=Image.Resampling.LANCZOS,
            )
    except (UnidentifiedImageError, OSError, ValueError):
        return jsonify(error='Please upload a valid JPEG, PNG, or WebP image.'), 400

    os.makedirs(AVATAR_FOLDER, exist_ok=True)
    avatar_filename = f"user_{session['user_id']}.webp"
    avatar_path = os.path.join(AVATAR_FOLDER, avatar_filename)
    temporary_path = f"{avatar_path}.{uuid.uuid4().hex}.tmp"
    avatar_image.save(temporary_path, format='WEBP', quality=88, method=6)
    os.replace(temporary_path, avatar_path)

    avatar_version = uuid.uuid4().hex
    avatar_url = f'/static/avatars/{avatar_filename}?v={avatar_version}'
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE users SET avatar_url = %s WHERE user_id = %s",
        (avatar_url, session['user_id']),
    )
    conn.commit()
    cursor.close()
    conn.close()

    user = find_user_by_id(session['user_id'])
    return jsonify(message='Profile picture updated.', user=public_user(user))


@app.route('/api/profile', methods=['GET', 'PATCH'])
def api_profile():
    if 'user_id' not in session:
        return jsonify(error='Authentication required.'), 401

    user_id = session['user_id']
    if request.method == 'GET':
        user = find_user_by_id(user_id)
        return jsonify(profile=profile_user(user))

    payload = request.get_json(silent=True) or {}
    username = str(payload.get('username', '')).strip()
    full_name = str(payload.get('full_name', '')).strip()
    bio = str(payload.get('bio', '')).strip()
    gender = str(payload.get('gender', '')).strip()
    address = str(payload.get('address', '')).strip()
    city = str(payload.get('city', '')).strip()
    state = str(payload.get('state', '')).strip()
    postcode = str(payload.get('postcode', '')).strip()

    if not username:
        return jsonify(error='Username is required.'), 400
    if len(username) > 100 or len(full_name) > 120 or len(bio) > 500:
        return jsonify(error='One or more profile fields are too long.'), 400
    if len(address) > 255 or len(city) > 100 or len(state) > 100 or len(postcode) > 20:
        return jsonify(error='One or more address fields are too long.'), 400
    if gender not in {'', 'female', 'male', 'non_binary', 'prefer_not_to_say'}:
        return jsonify(error='Please choose a valid gender option.'), 400

    existing_user = find_user_by_username(username)
    if existing_user and existing_user['user_id'] != user_id:
        return jsonify(error='Username is already taken.'), 409

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET username = %s WHERE user_id = %s", (username, user_id))
    cursor.execute(
        """
        INSERT INTO user_profiles
            (user_id, full_name, bio, gender, address, city, state, postcode)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            full_name = VALUES(full_name), bio = VALUES(bio), gender = VALUES(gender),
            address = VALUES(address), city = VALUES(city), state = VALUES(state),
            postcode = VALUES(postcode)
        """,
        (user_id, full_name or None, bio or None, gender or None, address or None,
         city or None, state or None, postcode or None),
    )
    conn.commit()
    cursor.close()
    conn.close()
    session['username'] = username

    user = find_user_by_id(user_id)
    return jsonify(message='Profile updated successfully.', profile=profile_user(user), user=public_user(user))


@app.route('/api/settings', methods=['GET', 'PATCH'])
def api_settings():
    if 'user_id' not in session:
        return jsonify(error='Authentication required.'), 401

    user_id = session['user_id']
    if request.method == 'GET':
        user = find_user_by_id(user_id)
        return jsonify(settings={
            'location_enabled': bool(user.get('location_enabled')),
            'preferred_language': user.get('preferred_language') or 'en',
            'theme': 'dark' if user.get('theme') == 'dark' else 'light',
        })

    payload = request.get_json(silent=True) or {}
    current_user = find_user_by_id(user_id)
    location_enabled = payload.get('location_enabled', bool(current_user.get('location_enabled')))
    theme = payload.get('theme', 'dark' if current_user.get('theme') == 'dark' else 'light')
    if not isinstance(location_enabled, bool):
        return jsonify(error='Location preference must be true or false.'), 400
    if theme not in {'light', 'dark'}:
        return jsonify(error='Theme must be light or dark.'), 400
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO user_profiles (user_id, location_enabled, theme)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE
            location_enabled = VALUES(location_enabled), theme = VALUES(theme)
        """,
        (user_id, location_enabled, theme),
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify(
        message='Settings updated.',
        settings={'location_enabled': location_enabled, 'theme': theme},
    )


@app.route('/api/detect', methods=['POST'])
def api_detect():
    if 'user_id' not in session:
        return jsonify(error='Authentication required.'), 401

    session.pop('pending_item', None)
    session.pop('pending_points', None)
    session.pop('pending_image_hash', None)

    image = request.files.get('image')
    if image is None or not image.filename:
        return jsonify(error='Please choose an image to analyze.'), 400

    original_filename = secure_filename(image.filename)
    if not original_filename:
        return jsonify(error='The selected image has an invalid filename.'), 400

    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    upload_filename = f"{uuid.uuid4().hex}_{original_filename}"
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], upload_filename)
    image.save(image_path)

    try:
        candidate_hash = generate_image_hash(image_path)
    except (OSError, UnidentifiedImageError):
        return jsonify(error='The uploaded file is not a valid image.'), 400

    duplicate = find_duplicate_image(session['user_id'], candidate_hash)
    if duplicate:
        return jsonify(
            error='This image appears to have already been used for a recycling record.',
            duplicate=True,
        ), 409

    results = model(image_path)
    boxes = results[0].boxes
    if len(boxes) == 0:
        return jsonify(error='No e-waste item was detected. Please try a clearer image with one item.'), 422

    best_idx = boxes.conf.argmax().item()
    confidence = boxes.conf[best_idx].item()
    if confidence < 0.30:
        return jsonify(error='No detection reached the required 30% confidence.', confidence=confidence), 422

    class_id = int(boxes.cls[best_idx])
    guideline = fetch_guideline(class_id)
    if guideline is None:
        return jsonify(error='No recycling guideline was found for the detected item.'), 422

    results[0].boxes = boxes[best_idx:best_idx + 1]
    detections_folder = os.path.join('static', 'detections')
    os.makedirs(detections_folder, exist_ok=True)
    annotated_filename = f"detected_{uuid.uuid4().hex}_{original_filename}"
    results[0].save(filename=os.path.join(detections_folder, annotated_filename))

    session['pending_item'] = guideline['category']
    session['pending_points'] = guideline.get('points', 0)
    session['pending_image_hash'] = candidate_hash

    return jsonify(
        category=guideline['category'],
        confidence=confidence,
        guideline=guideline['recycling_instruction'],
        points=guideline.get('points', 0),
        annotated_image_url=f'/static/detections/{annotated_filename}',
        centers_pdf_url='/static/centers.pdf',
    )


@app.route('/api/recycle', methods=['POST'])
def api_recycle():
    if 'user_id' not in session:
        return jsonify(error='Authentication required.'), 401

    item_type = session.get('pending_item')
    points = session.get('pending_points', 0)
    pending_image_hash = session.get('pending_image_hash')
    if not item_type:
        return jsonify(error='There is no pending detection to recycle.'), 400
    if not pending_image_hash:
        return jsonify(error='The pending detection has no image fingerprint. Please scan the item again.'), 400

    duplicate = find_duplicate_image(session['user_id'], pending_image_hash)
    if duplicate:
        session.pop('pending_item', None)
        session.pop('pending_points', None)
        session.pop('pending_image_hash', None)
        return jsonify(error='This image has already been used for a recycling record.'), 409

    record_recycle_history(session['user_id'], item_type, points, pending_image_hash)
    session.pop('pending_item', None)
    session.pop('pending_points', None)
    session.pop('pending_image_hash', None)
    return jsonify(
        message=f'Successfully recorded {item_type}. You earned {points} points.',
        category=item_type,
        points=points,
    )


@app.route('/api/history')
def api_history():
    if 'user_id' not in session:
        return jsonify(error='Authentication required.'), 401

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT item_type, points, timestamp
        FROM recycle_history
        WHERE user_id = %s
        ORDER BY timestamp DESC
        """,
        (session['user_id'],),
    )
    records = cursor.fetchall()
    cursor.close()
    conn.close()

    history_records = [
        {
            'item_type': record['item_type'],
            'points': int(record['points'] or 0),
            'timestamp': record['timestamp'].isoformat(),
        }
        for record in records
    ]
    return jsonify(
        history=history_records,
        total_points=sum(record['points'] for record in history_records),
    )


@app.route('/api/leaderboard')
def api_leaderboard():
    if 'user_id' not in session:
        return jsonify(error='Authentication required.'), 401

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT u.username, u.avatar_url, SUM(rh.points) AS total_score
        FROM users u
        JOIN recycle_history rh ON u.user_id = rh.user_id
        GROUP BY u.user_id, u.username, u.avatar_url
        ORDER BY total_score DESC
        LIMIT 10
        """
    )
    leaders = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(
        leaders=[
            {
                'rank': index,
                'username': leader['username'],
                'avatar_url': leader['avatar_url'],
                'total_score': int(leader['total_score'] or 0),
            }
            for index, leader in enumerate(leaders, start=1)
        ]
    )


@app.route('/api/mission')
def api_mission():
    if 'user_id' not in session:
        return jsonify(error='Authentication required.'), 401

    target = 100
    total = get_global_monthly_total()
    return jsonify(
        total=total,
        target=target,
        percentage=min(round(total / target * 100), 100),
        completed=total >= target,
    )


@app.route('/api/guidelines')
def api_guidelines():
    if 'user_id' not in session:
        return jsonify(error='Authentication required.'), 401

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT class_index, category, recycling_instruction, points
        FROM recycling_guidelines
        ORDER BY category
        """
    )
    guidelines = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(
        guidelines=[
            {
                'class_index': guideline['class_index'],
                'category': guideline['category'],
                'instruction': guideline['recycling_instruction'],
                'points': int(guideline['points'] or 0),
            }
            for guideline in guidelines
        ]
    )


@app.route('/api/centres/nearest')
def api_nearest_centres():
    if 'user_id' not in session:
        return jsonify(error='Authentication required.'), 401

    try:
        latitude = float(request.args.get('latitude', ''))
        longitude = float(request.args.get('longitude', ''))
    except (TypeError, ValueError):
        return jsonify(error='Valid latitude and longitude are required.'), 400

    if not math.isfinite(latitude) or not math.isfinite(longitude):
        return jsonify(error='Valid latitude and longitude are required.'), 400
    if not -90 <= latitude <= 90 or not -180 <= longitude <= 180:
        return jsonify(error='The supplied location is outside the valid coordinate range.'), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT centre_id, name, address, state, latitude, longitude,
               coordinate_quality, source_name, source_date
        FROM recycling_centres
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL
        """
    )
    centres = cursor.fetchall()
    cursor.close()
    conn.close()

    nearest = []
    for centre in centres:
        distance = haversine_distance(
            latitude,
            longitude,
            float(centre['latitude']),
            float(centre['longitude']),
        )
        directions_query = urlencode({
            'api': 1,
            'origin': f'{latitude},{longitude}',
            'destination': centre['address'],
            'travelmode': 'driving',
        })
        nearest.append({
            'centre_id': centre['centre_id'],
            'name': centre['name'],
            'address': centre['address'],
            'state': centre['state'],
            'distance_km': round(distance, 1),
            'distance_is_estimate': centre['coordinate_quality'] == 'postcode',
            'directions_url': f'https://www.google.com/maps/dir/?{directions_query}',
            'source_name': centre['source_name'],
            'source_date': centre['source_date'].isoformat() if centre['source_date'] else None,
        })

    nearest.sort(key=lambda centre: centre['distance_km'])
    return jsonify(
        centres=nearest[:5],
        total_geocoded=len(nearest),
        source_pdf_url='/static/centers.pdf',
        attribution='Coordinates geocoded with OpenStreetMap Nominatim.',
    )


def haversine_distance(latitude_one, longitude_one, latitude_two, longitude_two):
    earth_radius_km = 6371.0088
    latitude_delta = math.radians(latitude_two - latitude_one)
    longitude_delta = math.radians(longitude_two - longitude_one)
    latitude_one_radians = math.radians(latitude_one)
    latitude_two_radians = math.radians(latitude_two)
    haversine = (
        math.sin(latitude_delta / 2) ** 2
        + math.cos(latitude_one_radians)
        * math.cos(latitude_two_radians)
        * math.sin(longitude_delta / 2) ** 2
    )
    return earth_radius_km * 2 * math.asin(math.sqrt(haversine))


@app.route('/api/news')
def api_news():
    if 'user_id' not in session:
        return jsonify(error='Authentication required.'), 401

    return jsonify(articles=get_ewaste_news())


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    """Serve the production React build and support BrowserRouter refreshes."""
    if not os.path.isfile(os.path.join(FRONTEND_DIST, 'index.html')):
        return jsonify(
            error='React production build not found.',
            instruction='Run npm.cmd run build inside the frontend directory.',
        ), 503

    requested_file = safe_join(FRONTEND_DIST, path) if path else None
    if requested_file and os.path.isfile(requested_file):
        return send_from_directory(FRONTEND_DIST, path)

    if path.startswith('assets/') or os.path.splitext(path)[1]:
        abort(404)

    return send_from_directory(FRONTEND_DIST, 'index.html')




if __name__ == '__main__':
    if not os.path.exists('uploads'): os.makedirs('uploads')
    if not os.path.exists('static/detections'): os.makedirs('static/detections')
    app.run(debug=os.environ.get('FLASK_DEBUG') == '1', port=5000)
