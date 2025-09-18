Moria-Dungeon-Laptop

A small browser-based recreation of the classic 1980s roguelike "Moria" built with HTML, CSS, JavaScript, and JSON.

Getting started

Requirements
- A modern web browser (Chrome, Edge, Firefox)

Run locally
1. Open `index1-05.html` in your browser (double-click or open from the browser File->Open).
2. Or serve the folder using a simple HTTP server if you want proper module/asset behavior:

PowerShell (recommended):
```powershell
# Start a local server on port 8000
python -m http.server 8000
# Then open http://localhost:8000/index1-05.html
```

Project structure
- `index1-05.html` — main HTML file to open in the browser.
- `js/` — game JavaScript files (configuration, main game logic).
- `styles/` — CSS files for styling.
- `Tests/` — small test pages.
- `Versions/` — older versions of the project files.

Contributing
- Make small focused changes on feature branches:
```powershell
git checkout -b feature/your-change
# make edits, then
git add .
git commit -m "Describe your change"
git push -u origin feature/your-change
```
- Open a Pull Request on GitHub and ask for review.

Sharing with your son
- Invite him via the repository Settings → Manage access, or share the clone URL:
```
https://github.com/JimboWW/Moria-Dungeon-Laptop.git
```

Notes for learning
- If you'd like, I can add guided "learning tasks" in the repo that introduce small concepts and exercises (e.g., adding an item, building an enemy AI, or making a new level). Ask and I'll scaffold them.
