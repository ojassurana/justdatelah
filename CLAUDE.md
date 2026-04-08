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