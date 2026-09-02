# E-Waste Scanner

This branch contains a React frontend with a Flask API, YOLO detection, and MySQL storage.

## Environment variables

Copy the example file for local development:

```powershell
Copy-Item .env.example .env
```

Open `.env` and set:

```env
NEWSDATA_API_KEY=your_newsdata_key
SECRET_KEY=your_random_flask_secret
FLASK_DEBUG=1
```

The real `.env` file is ignored by Git. Generate a Flask secret with:

```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```

For Railway, configure the variables described in the deployment section below. Do not upload `.env` to Railway or GitHub.

## Railway deployment

The repository contains a multi-stage `Dockerfile`. Railway builds the React PWA with Node, installs the Flask/YOLO runtime with Python, and starts the application with Gunicorn. Do not commit `frontend/dist`; it is generated inside the deployment image.

### 1. Prepare and push the deployment branch

Run the local checks from the repository root:

```powershell
cd frontend
npm.cmd run lint
npm.cmd run build
cd ..
git status
```

Make sure the following required model assets are committed:

```text
best.pt
frontend/public/best.onnx
frontend/public/centers.pdf
```

The root-level `best.onnx`, `runs/`, `test.jpg`, `.env`, generated uploads, detections, avatars, `node_modules`, and `frontend/dist` are intentionally ignored.

Commit the reviewed changes and push the `react-migration` branch to GitHub.

### 2. Create the Railway project and database

1. Create a new Railway project.
2. Add a **MySQL** database service.
3. Add a service from the GitHub repository.
4. Select the `react-migration` branch and leave the root directory as `/`.
5. Railway will detect the root `Dockerfile`; no custom build or start command is needed.

### 3. Configure web-service variables

In the web service's **Variables** tab, add:

```env
SECRET_KEY=replace_with_a_long_random_value
SESSION_COOKIE_SECURE=1
FLASK_DEBUG=0
AI_API_KEY=replace_with_your_gemini_key
GEMINI_MODEL=gemini-3.7-flash
NEWSDATA_API_KEY=replace_with_your_newsdata_key
AVATAR_FOLDER=/data/avatars
MYSQLHOST=${{MySQL.MYSQLHOST}}
MYSQLPORT=${{MySQL.MYSQLPORT}}
MYSQLUSER=${{MySQL.MYSQLUSER}}
MYSQLPASSWORD=${{MySQL.MYSQLPASSWORD}}
MYSQLDATABASE=${{MySQL.MYSQLDATABASE}}
```

If the database service is not named `MySQL`, replace `MySQL` in every reference with the exact Railway service name. `AI_API_KEY` and `NEWSDATA_API_KEY` are optional only if their corresponding assistant/news features may remain unavailable.

Generate `SECRET_KEY` locally and copy only its output into Railway:

```powershell
py -c "import secrets; print(secrets.token_hex(32))"
```

Do not set `PORT`; Railway provides it automatically.

### 4. Add persistent avatar storage

1. Add a Railway Volume to the web service.
2. Set its mount path to `/data`.
3. Keep `AVATAR_FOLDER=/data/avatars` in the web-service variables.

Scanned source images and annotated detection images are temporary. User avatars are kept on the volume so they survive redeployments.

### 5. Import the MySQL schema

The complete `ewaste_db.sql` contains the current tables and recycling-centre seed data. Review whether you want to keep its existing sample users and recycling history before importing it into production.

One option is the Railway CLI plus a locally installed MySQL client:

```powershell
railway login
railway link
railway connect MySQL
```

At the MySQL prompt, run this with the absolute path to the repository file:

```sql
source C:/Users/ASUS/Desktop/ewaste/ewaste_db.sql;
```

Use the Railway database service's exact name in place of `MySQL` if different. Import the complete dump only once. For a database that already has older project tables, apply the numbered files under `migrations/` in order instead.

### 6. Deploy and configure networking

1. Deploy the staged Railway changes.
2. In the web service, open **Settings → Networking** and generate a public domain.
3. Set the health-check path to `/api/health` and allow a generous initial timeout because PyTorch loads the model during startup.
4. Check the deployment logs for Gunicorn startup, YOLO model loading, and database errors.

### 7. Production acceptance test

Using the Railway HTTPS domain:

1. Confirm `/api/health` returns `{"service":"ewaste-flask-api","status":"ok"}`.
2. Register, sign in, sign out, and sign in using both username and email.
3. Upload an avatar, redeploy once, and confirm the avatar remains available.
4. Run an online detection and record it; verify history, impact, badges, and leaderboard.
5. Test detection feedback and nearest verified centres.
6. Test the Gemini assistant and news panel.
7. Install the PWA while online and allow its roughly 41 MB offline cache to finish.
8. Switch the device offline, reload the PWA, and verify ONNX detection. Offline results cannot record points, submit feedback, or query live nearest-centre data.

### Operational notes

- The Gunicorn configuration uses one worker with four threads because each worker loads another copy of the YOLO model into memory.
- Back up Railway MySQL regularly.
- Monitor memory during model loading and detection. Increase the service memory if the container is terminated for out-of-memory usage.
- The web filesystem outside `/data` is disposable, so do not depend on generated detection files persisting across deployments.

## Development

Run Flask from the project root:

```powershell
python app.py
```

In a second terminal, run the Vite development server:

```powershell
cd frontend
npm.cmd run dev
```

Open `http://localhost:5173`. Vite proxies `/api` and `/static` requests to Flask on port 5000.

## Unified production-style build

Build React:

```powershell
cd frontend
npm.cmd run build
cd ..
```

Start Flask:

```powershell
python app.py
```

Open `http://localhost:5000`. Flask serves `frontend/dist/index.html`, built assets, API endpoints, and backend static files from one origin.

## User avatars

For an existing database, run [`migrations/001_add_avatar_url.sql`](migrations/001_add_avatar_url.sql) once before starting the updated application. A new database created from `ewaste_db.sql` already includes the column.

Users can upload JPEG, PNG, or WebP profile pictures up to 5 MB. Flask crops them to a square, stores them as 512 x 512 WebP files in `static/avatars`, and the frontend displays gold, silver, and bronze frames for the top three global ranks.

The local avatar folder is ignored by Git. Before deploying this feature to Railway, mount persistent storage for `static/avatars` or move avatar files to object storage; files written only to a service's temporary filesystem can disappear after a redeploy.

## Profiles and settings

The current `ewaste_db.sql` creates the optional `user_profiles` table used by the profile and settings pages. When upgrading an existing database without re-importing the full dump, run `migrations/003_add_user_profiles.sql` once instead.

Profile email addresses are read-only. Optional profile information is stored separately from login credentials, and the location setting stores only an enabled/disabled preference—not browser coordinates.

## Verified recycling centres

The nearest-centres feature uses the government-issued list in `static/centers.pdf`, updated 5 February 2021. The SQL dump contains all 127 extracted centres; 120 have cached coordinates and seven vague-address entries remain in the official PDF only.

Distances are calculated locally by Flask with the Haversine formula. Address-level coordinates are used when available; otherwise the UI explicitly labels the result as an estimate based on the postcode area. Google Maps is used only when the user chooses Directions. Browser coordinates are sent to Flask for that request and are not stored.

Coordinates were generated once with OpenStreetMap Nominatim under its usage policy and are cached in the database. © OpenStreetMap contributors. The reproducible extraction/geocoding scripts and intermediate data are in `scripts/` and `data/`.

For an existing database, run `migrations/004_add_recycling_centres.sql` once. A complete import of `ewaste_db.sql` already contains the table and seed records.

To enable Flask debug mode temporarily in PowerShell:

```powershell
$env:FLASK_DEBUG = '1'
python app.py
```
