import os
import uuid
import requests
from dotenv import load_dotenv
from flask import Flask, request, session, jsonify, abort, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import safe_join, secure_filename
from ultralytics import YOLO
from PIL import Image, ImageOps, UnidentifiedImageError
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

def record_recycle_history(user_id, category, points):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "INSERT INTO recycle_history (user_id, item_type, points) VALUES (%s, %s, %s)"
    cursor.execute(query, (user_id, category, points))
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


def find_user_by_id(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT user_id, username, avatar_url FROM users WHERE user_id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user


def public_user(user):
    return {
        'user_id': user['user_id'],
        'username': user['username'],
        'avatar_url': user.get('avatar_url'),
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

    create_user(username, email, password)
    return jsonify(message='Account created successfully. You can now sign in.'), 201


@app.route('/api/auth/login', methods=['POST'])
def api_login():
    payload = request.get_json(silent=True) or {}
    email = str(payload.get('email', '')).strip()
    password = str(payload.get('password', ''))
    user = find_user_by_email(email) if email and password else None

    if user is None or not check_password_hash(user['password'], password):
        return jsonify(error='Invalid email or password.'), 401

    session.clear()
    session['user_id'] = user['user_id']
    session['username'] = user['username']
    return jsonify(
        message='Signed in successfully.',
        user=public_user(user),
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


@app.route('/api/detect', methods=['POST'])
def api_detect():
    if 'user_id' not in session:
        return jsonify(error='Authentication required.'), 401

    session.pop('pending_item', None)
    session.pop('pending_points', None)

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

    results = model(image_path)
    boxes = results[0].boxes
    if len(boxes) == 0:
        return jsonify(error='No e-waste item was detected. Please try a clearer image with one item.'), 422

    best_idx = boxes.conf.argmax().item()
    confidence = boxes.conf[best_idx].item()
    if confidence < 0.60:
        return jsonify(error='No detection reached the required 60% confidence.', confidence=confidence), 422

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

    search_query = 'e-waste disposal'
    maps_query = search_query.replace(' ', '+')
    return jsonify(
        category=guideline['category'],
        confidence=confidence,
        guideline=guideline['recycling_instruction'],
        points=guideline.get('points', 0),
        annotated_image_url=f'/static/detections/{annotated_filename}',
        map_url=f'https://www.google.com/maps/search/{maps_query}',
        centers_pdf_url='/static/centers.pdf',
    )


@app.route('/api/recycle', methods=['POST'])
def api_recycle():
    if 'user_id' not in session:
        return jsonify(error='Authentication required.'), 401

    item_type = session.get('pending_item')
    points = session.get('pending_points', 0)
    if not item_type:
        return jsonify(error='There is no pending detection to recycle.'), 400

    record_recycle_history(session['user_id'], item_type, points)
    session.pop('pending_item', None)
    session.pop('pending_points', None)
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
