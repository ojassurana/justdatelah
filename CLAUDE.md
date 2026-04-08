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