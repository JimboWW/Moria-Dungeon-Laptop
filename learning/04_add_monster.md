Lesson 4 — Add a simple monster

Goal: Add a monster that appears on the map and can be bumped into.

Steps:
1. Add a `monsters` array to your game state in `js/main.js`.
2. Define a monster object: `{ x: 10, y: 6, symbol: 'm', hp: 3 }`.
3. Render monsters in the map render function.
4. When the player moves into a monster's cell, reduce the monster's HP and remove it when HP <= 0.

Starter snippet:
```javascript
let monsters = [ { x:10, y:6, symbol:'m', hp:3 } ];
function checkBump(nx, ny) {
  const m = monsters.find(mon => mon.x === nx && mon.y === ny);
  if (m) {
    m.hp -= 1;
    if (m.hp <= 0) monsters = monsters.filter(mon => mon.hp > 0);
    return true; // bump happened
  }
  return false;
}
```

Mini exercise:
- Add one monster and implement bump-to-attack behavior; commit to `feature/add-monster`.