Lesson 3 — Implement basic player movement

Goal: Hook up arrow key controls to move the player on the map.

Starter guidance:
1. Inspect `js/main.js` for the player position and rendering logic.
2. Add a keyboard event listener:

```javascript
window.addEventListener('keydown', function(e) {
  // use e.key or e.keyCode to check arrows
});
```

3. Update player coordinates and re-render the map after movement.

Starter snippet (pseudo-code):
```javascript
// ...existing code...
let player = { x: 5, y: 5 };
function movePlayer(dx, dy) {
  player.x += dx;
  player.y += dy;
  render();
}
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') movePlayer(0, -1);
  if (e.key === 'ArrowDown') movePlayer(0, 1);
  if (e.key === 'ArrowLeft') movePlayer(-1, 0);
  if (e.key === 'ArrowRight') movePlayer(1, 0);
});
```

Mini exercise:
- Implement movement, keep the player inside map bounds, and commit to `feature/player-move`.