Lesson 1 — Run the project locally

Goal: Open the game in a browser and verify it loads.

Steps:
1. Open `index1-05.html` in your browser (double-click or File → Open).
2. If assets don't load correctly, start a local server in the repo root:

PowerShell:
```powershell
python -m http.server 8000
# open http://localhost:8000/index1-05.html
```

What to look for:
- The page loads without JavaScript errors (open DevTools Console).
- The player symbol `@` appears on the map (or the game UI loads).

Mini exercise:
- Take a screenshot of the page and commit it to a new branch named `feature/run-check`.