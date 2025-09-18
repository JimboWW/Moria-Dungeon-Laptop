Lesson 5 — Add scoring and persistence

Goal: Add a simple score that increases when monsters are killed and persist it in `localStorage`.

Steps:
1. Add `let score = 0;` to your game state in `js/main.js`.
2. When a monster dies, increase `score` by some amount.
3. Render the score in the UI (e.g., a `div` with id `score`).
4. Persist score to `localStorage` so it survives reloads:

```javascript
localStorage.setItem('moria_score', score);
// read on load:
const saved = localStorage.getItem('moria_score');
if (saved) score = Number(saved);
```

Mini exercise:
- Add the score, show it on screen, and persist it; commit to `feature/add-score`.