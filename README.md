# OpenRescue

OpenRescue is an AI-assisted disaster response resource system for reporting, classifying, and visualizing incidents in real time.

## What It Does

- Accepts incident reports with description and location.
- Predicts incident severity (`Low`, `Medium`, `High`, `Critical`) using an ML model.
- Streams new incidents to connected clients over WebSockets.
- Displays incidents on a live Leaflet map with severity-based marker colors.

## Current Stack

- Backend: `FastAPI`, `scikit-learn`, `uvicorn`
- Frontend: `Next.js`, `React`, `TypeScript`, `react-leaflet`
- Data state: in-memory list (current prototype)

## Project Structure

```text
OpenRescue/
  backend/
    main.py                 # API + WebSocket server
    requirements.txt
    ml/
      train_model.py        # trains and saves model/vectorizer
      severity_model.pkl
      vectorizer.pkl
  frontend/
    app/
      dashboard/
        page.tsx
        MapComponent.tsx    # live map + websocket updates
```

## Backend Setup

```bash
cd OpenRescue/backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at `http://127.0.0.1:8000`.

## Frontend Setup

```bash
cd OpenRescue/frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

If your backend URL is different, set:

```bash
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000
```

## API Endpoints

- `GET /` - health message
- `POST /report` - report incident
- `GET /incidents` - fetch all incidents
- `WS /ws` - real-time incident stream

### `POST /report` request body

```json
{
  "description": "Flood water entering houses",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

### Example response

```json
{
  "id": 1,
  "description": "Flood water entering houses",
  "lat": 12.9716,
  "lon": 77.5946,
  "severity": "High"
}
```

## Notes

- The current backend uses temporary in-memory storage; data resets when server restarts.
- CORS is currently open (`allow_origins=["*"]`) for development convenience.
- Model artifacts are already included in `backend/ml`.

## Roadmap

- Persist incidents in a database.
- Add team assignment and dispatch workflow.
- Add authentication and role-based dashboards.
- Improve severity model with larger training data.
