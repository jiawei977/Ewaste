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

For Railway, create the same `NEWSDATA_API_KEY` and `SECRET_KEY` variables in the web service's Variables section. Do not upload `.env` to Railway or GitHub.

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
