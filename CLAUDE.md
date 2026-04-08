# Project Instructions


## Git Workflow — STRICT RULES

### Committing
- Commit after every completed logical change (e.g. finished a function, fixed a bug, added a route, updated a component)
- Do NOT batch multiple unrelated changes into one commit
- Do NOT wait until the end of a task to commit everything at once
- Stage only the files relevant to the change — no `git add .` unless everything is related

### Commit Messages
- Use conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `style:`, `test:`, `chore:`
- Include scope when relevant: `feat(auth): add JWT refresh token rotation`
- Keep subject line under 72 characters
- Add a body for non-trivial changes explaining WHY, not just what
- Example:
  ```
  fix(api): handle null user in session middleware

  Previously the middleware assumed req.user was always set after auth,
  but expired tokens could leave it null. Added explicit null check
  with 401 response.
  ```

### Pushing
- Push to remote immediately after every commit — do not accumulate local commits
- NEVER force push (`--force` or `--force-with-lease`) — this is a shared branch
- NEVER amend a commit that has already been pushed
- NEVER rebase a shared branch
- If push fails due to remote changes, pull with `git pull --rebase` first, resolve any conflicts, then push again
- Never commit secrets, .env files, or API keys
- Never run destructive database commands without asking


## Web Design Verification — SELF-TEST RULE

After making any web-facing change (UI, templates, styles, layouts, routes that render pages), you MUST verify it yourself using the browser tool before considering the task done:

- Start the dev server if it isn't already running
- Use the browser to navigate to the affected page(s)
- Visually confirm the change renders correctly — check layout, styling, content, and responsiveness
- If something looks off, debug and fix it immediately, then re-check
- Do NOT ask the user to verify unless you've already confirmed it looks correct yourself
- This applies to all frontend work: new pages, styling tweaks, component changes, form layouts, etc.

### How to use CMUX Browser

CMUX is the terminal app running this project. It has a built-in browser for testing web pages.

```bash
# Open a URL in the browser pane (creates one if needed)
cmux browser open "http://localhost:8000/form"

# Navigate an existing browser surface to a URL
cmux browser navigate "http://localhost:8000/form" --surface surface:5

# Take an accessibility-tree snapshot of the page
cmux browser snapshot --surface surface:5
cmux browser snapshot --surface surface:5 --compact

# Interact with elements (use ref= IDs from snapshot)
cmux browser click <ref>  --surface surface:5
cmux browser fill <ref> "text" --surface surface:5
cmux browser select <ref> "value" --surface surface:5
cmux browser check <ref> --surface surface:5

# Evaluate JS in the page
cmux browser eval "document.querySelector('.error')?.innerText" --surface surface:5

# Add --snapshot-after to any interaction to get updated tree immediately
cmux browser click <ref> --surface surface:5 --snapshot-after
```

Key notes:
- After `browser open`, note the `surface=surface:N` in the output and use it for subsequent commands
- Use `snapshot` to get element refs, then interact using those refs
- File inputs cannot be filled programmatically (browser security); test file uploads via curl instead


## Architecture

Split deployment: Next.js frontend on Vercel, FastAPI backend hosted separately.

### Project Structure
- `frontend/` — Next.js app (deployed to Vercel, root directory set in Vercel project settings)
- `main.py` — FastAPI backend (run locally during dev, deploy to Railway/Render/VPS for prod)
- `requirements.txt` — Python dependencies for the backend

### Development Setup
- Frontend: hosted on Vercel (https://justdatelah-eight.vercel.app) — no local frontend server needed
- Backend: `uvicorn main:app --host 127.0.0.1 --port 8000` on your Mac
- Vercel env var `NEXT_PUBLIC_API_URL=http://localhost:8000` — the Vercel site calls your local backend
- Only YOU can use the site during dev (other people's browsers can't reach your localhost)

### Production Setup (future)
- Frontend: Vercel with custom domain (e.g. justdatelah.com)
- Backend: Railway/Render/VPS with custom domain (e.g. api.justdatelah.com)
- Change `NEXT_PUBLIC_API_URL` in Vercel env vars to the public backend URL
- Set `FRONTEND_URL` env var on backend to the Vercel domain (for CORS)

### API Configuration
- All frontend API calls MUST use the `NEXT_PUBLIC_API_URL` environment variable, never hardcoded URLs
- Never use relative `/api` paths for backend calls — those are Vercel serverless functions, not our backend
- Backend must have CORS middleware allowing the Vercel frontend origin
- When adding new API endpoints on the backend, always add the corresponding frontend fetch using `NEXT_PUBLIC_API_URL`
- Backend API routes are all prefixed with `/api/` (e.g. `/api/submit`, `/api/form-options`)
- Frontend routes are Next.js pages in `frontend/app/` (e.g. `/form`, `/matches`)

### Environment Variables
- Vercel (set in dashboard): `NEXT_PUBLIC_API_URL=http://localhost:8000` (dev) or public backend URL (prod)
- Backend: `FRONTEND_URL` env var for CORS (defaults to allowing `http://localhost:3000`)
- Never commit `.env.local`