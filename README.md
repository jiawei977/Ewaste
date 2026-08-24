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

To enable Flask debug mode temporarily in PowerShell:

```powershell
$env:FLASK_DEBUG = '1'
python app.py
```
