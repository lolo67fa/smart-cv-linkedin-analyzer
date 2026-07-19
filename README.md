# AI Career Agent

An AI-powered career platform with five specialized agents that help you land your next role:

- **CV Agent** — analyzes your CV against a target role, scores it, and rewrites weak sections.
- **LinkedIn Agent** — polishes your LinkedIn About section and suggests a stronger headline.
- **Career Coach Agent** — gap analysis + a concrete 30/60/90-day action plan.
- **Learning Agent** — recommends what skills to learn next and where (courses, projects, practice).
- **Interview Agent** — runs a full mock interview: generates questions, scores your answers, gives feedback.

No account, no database — upload a CV, pick a target role, and go.

## Tech stack

- **Backend:** Python / Flask, [Google Gemini](https://ai.google.dev/) (`gemini-2.5-flash`) for AI feedback, `pypdf` / `python-docx` for CV parsing.
- **Frontend:** React 19 + Vite, plain CSS (no framework), `html2canvas` + `jspdf` for PDF export.

## Project structure

```
backend/
  app.py                 # Flask routes
  cv_parser.py            # PDF/DOCX text extraction
  role_data.py             # target roles + keyword lists
  scoring.py                # deterministic keyword/text scoring
  gemini_client.py           # shared Gemini call + JSON parsing helper
  agents/                     # one module per agent (cv, linkedin, coach, learning, interview)
frontend/
  src/
    App.jsx                    # orchestrator: form state, intake call, layout
    api.js                      # fetch wrappers for every backend endpoint
    components/                  # Navbar, Hero, AnalyzerForm, AgentWorkspace, agent panels, ...
```

## Setup

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and add your own key:

```bash
cp .env.example .env
```

```
GEMINI_API_KEY=your_gemini_api_key_here
```

Get a free key at [Google AI Studio](https://aistudio.google.com/apikey). Note: the free tier is capped at 20 requests/day for `gemini-2.5-flash` — a single full walkthrough (CV + LinkedIn + Coach + Learning + Interview) uses 5-6+ requests, so plan demo runs accordingly.

Run the API:

```bash
python app.py
```

Serves on `http://127.0.0.1:5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Serves on `http://localhost:5173`. It talks to the backend at `http://127.0.0.1:5000` by default — set `VITE_API_URL` in a `frontend/.env` file to point elsewhere.

## API endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/roles` | list of supported target roles |
| POST | `/analyze` | upload CV + form data, get baseline scores + extracted CV text |
| POST | `/agents/cv` | CV Agent feedback |
| POST | `/agents/linkedin` | LinkedIn Agent feedback |
| POST | `/agents/coach` | Career Coach gap analysis + action plan |
| POST | `/agents/learning` | Learning Agent skill/resource recommendations |
| POST | `/agents/interview/questions` | generate mock interview questions |
| POST | `/agents/interview/evaluate` | score a submitted interview answer |

Every `/agents/*` endpoint degrades gracefully (keyword-based fallback) if `GEMINI_API_KEY` is missing or the API call fails.
