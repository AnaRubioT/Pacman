# Rubric: CORE

**Covers:** display geometry, maze rendering, Pac-Man movement and controls, wall collision, dot/pellet scoring basics, lives, game flow, level transitions, Pac-Man speeds across all level ranges.

The score is the highest tier whose checklist is *fully* satisfied. Items marked `*(manual)*` need visual verification by playing the game; they do not block tier progression automatically. The static checks gate tier advancement on what can be verified from the source code.

Pac-Man speeds are stated as **approximate time to cross the maze** (about 28 tiles in a clear straight corridor). The manual playtest is what confirms the speed feels right.

---

## Tier 1 — Level 1 baseline

A complete Level 1 game with Pac-Man controllable, walls respected, scoring working, lives and win/lose conditions in place.

- A `<canvas>` element exists in the DOM, taller than wide, rendered each frame.
- The maze is rendered with dark-blue walls and the iconic Pac-Man corridor pattern. *(manual)*
- ~240 small dots are visible along the corridors. *(manual)*
- 4 power pellets are visible near the four corners of the maze. *(manual)*
- HUD text (score, lives) is rendered above or below the maze. It does NOT overlap the maze. *(manual)*
- A lives counter is rendered alongside the score. *(manual)*
- Pac-Man is visible at his starting position, drawn in yellow. *(manual)*
- Pac-Man's starting position is on an open path tile — NOT on a wall, NOT inside the ghost-house chamber, and NOT on a tile that holds a dot or power pellet. The score stays at 0 the moment the game starts and only increments once Pac-Man actually moves and eats his first pellet. *(manual)*
- Arrow keys (or WASD) change Pac-Man's direction. A single keypress sets his direction; he moves continuously in that direction until a wall or the next direction change. *(manual)*
- Pac-Man CANNOT pass through walls. The next-tile check is applied BEFORE the position update. *(manual)*
- Eating a regular dot removes it from the maze and adds **10** to the score. *(manual)*
- Eating a power pellet removes it and adds **50** to the score. *(manual)*
- The score is rendered to the HUD each frame and updates in real time. *(manual)*
- The side tunnel wraps: crossing one edge appears at the opposite edge. *(manual)*
- The game starts with **3 lives**.
- A win condition fires when all pickups (dots + pellets) are eaten. *(manual)*
- A "READY!" (or SPACE-to-start) state shows at game start. *(manual)*
- When Pac-Man dies, the life count decrements, and either respawn happens (lives > 0) or "GAME OVER" appears (lives = 0). *(manual)*
- A Pac-Man speed constant or variable exists in code (any reasonable value — does not need to vary by level yet).

**Pac-Man speed at Level 1 (per spec §5):** approximately **4 seconds** to cross the maze in a clear corridor. The actual feel is verified by playing — Pac-Man should not zip across in under 2 seconds, and should not crawl. *(manual)*

---

## Tier 2 — Levels 2-4

All of Tier 1, plus multi-level scaling and the persistent / structured features that the simple baseline does not have.

- A `level` variable tracks the current level, starts at 1, increments on level clear.
- Level transition resets entities to starting positions, refills the maze, advances `level` by 1, then resumes play.
- A **Pac-Man speed table** indexed by `level` is defined in code. The Level 2-4 value differs from the Level 1 value.
- The high score persists across page reloads via `localStorage` (or equivalent). The identifier `localStorage` appears in code.
- A bonus life is awarded once per run when the score crosses **10,000 points**. The literal `10000` appears in code.

**Pac-Man speed at Levels 2-4:**

- Normal: **~3.5 seconds** to cross the maze.
- Eating dots: **~4 seconds**.

The speed table is actually applied each frame — Pac-Man visibly moves faster at Level 2 than at Level 1. *(manual)*

---

## Tier 3 — Levels 5-20

All of Tier 2, plus per-level scaling for Levels 5-20.

- The Pac-Man speed table includes distinct values for the Levels 5-20 range, different from the Levels 2-4 range.

**Pac-Man speed at Levels 5-20:**

- Normal: **~3 seconds** to cross the maze.
- Eating dots: **~3.5 seconds**.

Pac-Man visibly moves faster at Level 5+ than at Level 4. *(manual)*

---

## Tier 4 — Levels 21+ (no regression, run to 255)

All of Tier 3, plus the Level 21+ regression and the end-of-run handling.

- The Pac-Man speed table has a Levels 21+ row distinct from Levels 5-20. The value matches Levels 2-4 (regression to slower speed).
- The game runs cleanly through Levels 21 to 255 with no crashes or stalls. *(manual)*
- Clearing **Level 255** ends the run with a final-screen overlay (e.g. "CONGRATULATIONS — Level 255 cleared!"). The game does NOT advance to a Level 256. *(manual)*
- No earlier-tier feature has regressed. Pac-Man movement, wall collision, dot/pellet eating, win condition, level transitions, HUD, score and high score all still work as they did at Tier 1-3.

**Pac-Man speed at Levels 21+:**

- Normal: **~3.5 seconds** to cross the maze (same as Levels 2-4).
- Eating dots: **~4 seconds**.

Pac-Man visibly slows down going from Level 20 to Level 21. *(manual)*
