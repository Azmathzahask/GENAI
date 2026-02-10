## Deploy VidyāMitra on Vercel

This repo is set up as a **single Vercel project**:
- **Frontend**: Vite/React in `web/`
- **Backend**: FastAPI exposed as a Vercel Python function at `/api` via `api/index.py`

### 1) Install Vercel CLI

```powershell
npm i -g vercel
vercel login
```

### 2) Deploy

From `c:\Users\azmat\GENAI`:

```powershell
vercel
```

Answer prompts:
- Framework: choose **Other** (Vercel will use `vercel.json`)
- Link to existing project: **No** (first time) or **Yes** (subsequent)

Then for production:

```powershell
vercel --prod
```

### 3) Environment variables (optional for now)

The app works with stub AI responses even without keys.
If you want real integrations, add env vars in Vercel Project Settings:

- `OPENAI_API_KEY`
- `GOOGLE_API_KEY`
- `YOUTUBE_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `PEXELS_API_KEY`
- `NEWS_API_KEY`
- `EXCHANGE_API_KEY`
- `JWT_SECRET_KEY`
- `FRONTEND_ORIGIN` (optional on Vercel; CORS can also be relaxed later)

### Notes

- Frontend calls the backend using a **relative** base URL (`/api`) by default.
- If you later host the backend elsewhere, set `VITE_API_BASE_URL` in the Vercel frontend env.

