import os
import uuid
import requests
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from ultralytics import YOLO
from PIL import Image
import mysql.connector

from auth import login_required

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
    api_key = 'pub_8abef65c69e04e37ada1cb988af6cdf7'
    # We broadened the query to 'e-waste OR recycling' and removed the strict category for more results
    url = f'https://newsdata.io/api/1/news?apikey={api_key}&q=e-waste&language=en,ms&removeduplicate=1'
    try:
        response = requests.get(url, timeout=5)
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
    cursor.execute("SELECT user_id, username, email, password FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user


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

    return jsonify(
        authenticated=True,
        user={
            'user_id': session['user_id'],
            'username': session['username'],
        },
    )


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
        user={'user_id': user['user_id'], 'username': user['username']},
    )


@app.route('/api/auth/logout', methods=['POST'])
def api_logout():
    session.clear()
    return jsonify(message='Signed out successfully.')


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
        SELECT u.username, SUM(rh.points) AS total_score
        FROM users u
        JOIN recycle_history rh ON u.user_id = rh.user_id
        GROUP BY u.user_id, u.username
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


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')

        if not username or not email or not password:
            flash('Please fill in all fields.')
        elif password != confirm_password:
            flash('Passwords do not match.')
        elif find_user_by_email(email):
            flash('Email is already registered.')
        else:
            create_user(username, email, password)
            return redirect(url_for('login'))

    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user = find_user_by_email(email)

        if user is None or not check_password_hash(user['password'], password):
            flash('Invalid email or password.')
        else:
            session.clear()
            session['user_id'] = user['user_id']
            session['username'] = user['username']
            return redirect(url_for('index'))

    return render_template('login.html')


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))


@app.route('/', methods=['GET', 'POST'])
@login_required
def index():
    detected_name = None
    instruction = None
    show_modal = False
    annotated_img_url = None
    map_url = None
    embed_url = None
    
    if request.method == 'POST':
        file = request.files['image']
        if file:
            # Save the image
            img_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(img_path)
            
            # Run YOLO
            results = model(img_path)
            boxes = results[0].boxes

            # Check if any items detected and if the best one meets the 60% confidence threshold
            if len(boxes) > 0 and boxes.conf.max().item() >= 0.60:
                # Find the index of the highest confidence detection
                best_idx = boxes.conf.argmax().item()
                id = int(boxes.cls[best_idx])

                # Fetch data from MySQL
                data = fetch_guideline(id)

                if data:
                    detected_name = data['category']
                    instruction = data['recycling_instruction']
                    points = data.get('points', 0)

                    # Display only the detection with the highest confidence.
                    results[0].boxes = boxes[best_idx:best_idx + 1]

                    # Save annotated image for display in the popup
                    os.makedirs('static/detections', exist_ok=True)
                    annotated_filename = f"detected_{uuid.uuid4().hex}_{file.filename}"
                    results[0].save(filename=os.path.join('static', 'detections', annotated_filename))
                    
                    annotated_img_url = url_for('static', filename=f'detections/{annotated_filename}')
                    
                    # Store detection data in session for later confirmation
                    session['pending_item'] = detected_name
                    session['pending_points'] = points
                    
                    # Generate Google Maps URL for nearest recycling center
                    search_query = "e-waste disposal"
                    map_url = f"https://www.google.com/maps/search/{search_query.replace(' ', '+')}"
                    embed_url = f"https://maps.google.com/maps?q={search_query.replace(' ', '+')}&output=embed"
                    show_modal = True
                else: 
                    detected_name = "Unknown"
                    instruction = "No disposal guideline found for this item."
            else:
                flash("The model could not detect any e-waste items in this image. Please try again with a clearer photo and ensure one item at once.")

    news_articles = get_ewaste_news()
    global_total = get_global_monthly_total()
    global_target = 100
    return render_template('index.html', 
                         result=detected_name, 
                         guideline=instruction, 
                         news=news_articles, 
                         show_modal=show_modal, 
                         annotated_img=annotated_img_url,
                         map_url=map_url,
                         embed_url=embed_url,
                         global_total=global_total,
                         global_target=global_target)

@app.route('/confirm_recycle', methods=['POST'])
@login_required
def confirm_recycle():
    item_type = session.get('pending_item')
    points = session.get('pending_points', 0)
    if item_type:
        record_recycle_history(session['user_id'], item_type, points)
        flash(f"Successfully recorded! You earned {points} points for recycling {item_type}.")
    session.pop('pending_item', None)
    session.pop('pending_points', None)
    return redirect(url_for('index'))

@app.route('/history')
@login_required
def history():
    user_id = session.get('user_id')
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Fetch this specific user's history
    cursor.execute("""
        SELECT item_type, points, timestamp 
        FROM recycle_history 
        WHERE user_id = %s 
        ORDER BY timestamp DESC
    """, (user_id,))
    user_records = cursor.fetchall()
    
    # Calculate total points for the user
    total_points = sum(record['points'] for record in user_records)
    
    cursor.close()
    conn.close()
    return render_template('history.html', history=user_records, total=total_points)

@app.route('/leaderboard')
@login_required
def leaderboard():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Aggregates points per user to find the top 10
    query = """
        SELECT u.username, SUM(rh.points) as total_score 
        FROM users u 
        JOIN recycle_history rh ON u.user_id = rh.user_id 
        GROUP BY u.user_id 
        ORDER BY total_score DESC 
        LIMIT 10
    """
    cursor.execute(query)
    top_players = cursor.fetchall()
    
    cursor.close()
    conn.close()
    return render_template('leaderboard.html', leaders=top_players)




if __name__ == '__main__':
    if not os.path.exists('uploads'): os.makedirs('uploads')
    if not os.path.exists('static/detections'): os.makedirs('static/detections')
    app.run(debug=True, port=5000)
