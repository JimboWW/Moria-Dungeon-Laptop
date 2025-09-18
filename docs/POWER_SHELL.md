PowerShell Quick Guide — Moria Dungeon Project

This file gives short, copyable PowerShell commands useful when working on this repository.

Open a PowerShell window
- Press Win, type "PowerShell", and run "Windows PowerShell" (or right-click and Run as administrator when needed).

Navigation and basic commands
- Change directory:
```powershell
cd 'C:\Users\jimwi\OneDrive\Desktop\Moria-Dungeon-Repository'
```
- List files: `dir` or `ls`
- Show current path: `pwd`

Start a simple HTTP server (for testing in the browser)
```powershell
# from repo root
python -m http.server 8000
# open http://localhost:8000/index1-05.html in your browser
```

Common Git workflow (copyable)
```powershell
# make a feature branch
git checkout -b feature/my-change
# check status
git status --porcelain -b
# stage changes
git add .
# commit
git commit -m "Add short description of change"
# push branch and set upstream
git push -u origin feature/my-change
# when ready, switch back to main and pull updates
git checkout main; git pull --rebase
# merge in your branch locally
git merge feature/my-change
# push merged main
git push origin main
```

Running the project and quick checks
- View the page and DevTools Console for JS errors: open DevTools with F12.
- Search files with `Select-String` (PowerShell's grep):
```powershell
Select-String -Path .\js\*.js -Pattern "SYMBOLS" -CaseSensitive
```

Useful PowerShell differences to know
- Environment variables: `$env:PATH`, set with `$env:FOO = 'bar'` (temporary for session).
- Use `;` to join commands: `cd repo; git status`.
- Use `--%` to stop PowerShell from parsing the rest of the line (useful for some native commands).
- Check a program's exit code: `$LASTEXITCODE`

If you prefer a Unix-like shell on Windows
- Install Git for Windows and use Git Bash.
- Or install WSL (Windows Subsystem for Linux) and use Bash.

Need more?
- I can add example PowerShell scripts for common tasks (start server, run a quick dev watcher), or create a `tasks.json` for VS Code if you use it. Tell me which one you'd like.