# Rubric: CORE

**Covers:** display geometry, maze rendering, Pac-Man movement and controls, wall collision, dot/pellet scoring basics, lives, game flow, level transitions, Pac-Man speeds across all level ranges.

The score is the highest tier whose checklist is *fully* satisfied. Items marked `*(manual)*` need visual verification by playing the game; they do not block tier progression automatically. The static checks gate tier advancement on what can be verified from the source code.

Pac-Man speeds are stated as **approximate time to cross the maze** (about 28 tiles in a clear straight corridor). The manual playtest is what confirms the speed feels right.

---

## Tier 1 — Level 1 baseline

A complete Level 1 game with Pac-Man controllable, walls respected, scoring working, lives and win/lose conditions in place.

- A `canvas` with `getContext` and `requestAnimationFrame` is in the code.
- The maze is rendered with dark-blue walls and the iconic Pac-Man corridor pattern. *(manual)*
- ~240 small dots are visible along the corridors. *(manual)*
- 4 power pellets are visible near the four corners of the maze. *(manual)*
- HUD `score` and `lives` are rendered above or below the maze. They do NOT overlap the maze. *(manual)*
- Pac-Man is visible at his starting position, drawn in yellow. *(manual)*
- Pac-Man's starting position is on an open path tile — NOT on a wall, NOT inside the ghost-house chamber, and NOT on a tile that holds a dot or power pellet. The `score` stays at 0 the moment the game starts. *(manual)*
- Arrow keys (or WASD) change Pac-Man's direction. A single keypress sets his direction; he moves continuously until a wall or the next direction change. *(manual)*
- Pac-Man cannot pass through walls. The next-tile check is applied BEFORE the position update. *(manual)*
- Eating a regular dot removes it from the maze and adds **10** to the `score`. *(manual)*
- Eating a power pellet removes it and adds **50** to the `score`. *(manual)*
- The `score` updates in the HUD in real time. *(manual)*
- The side `tunnel` wraps: crossing one edge appears at the opposite edge. *(manual)*
- The code initializes `lives = 3`.
- A win condition fires when all pickups (dots + pellets) are eaten. *(manual)*
- A "READY!" (or SPACE-to-start) state shows at game start. *(manual)*
- When Pac-Man dies, `lives` decrements, and either respawn happens or "GAME OVER" appears. *(manual)*
- The code uses `pacman.speed` (or similar) for Pac-Man's movement speed.

**Pac-Man speed at Level 1 (per spec §5):** approximately **4 seconds** to cross the maze in a clear corridor. The actual feel is verified by playing — Pac-Man should not zip across in under 2 seconds, and should not crawl. *(manual)*

---

## Tier 2 — Levels 2-4

All of Tier 1, plus multi-level scaling and the persistent / structured features that the simple baseline does not have.

- A `level` variable tracks the current level, starts at 1, increments on level clear.
- Level transition resets entities to starting positions, refills the maze, advances `level` by 1, then resumes play.
- A `pacmanSpeed` table (or `speeds[level]`) is indexed by `level`. The Level 2-4 value differs from the Level 1 value.
- `localStorage` is used to persist the high score across page reloads.
- The `score` triggers a bonus life at `10000` points.

**Pac-Man speed at Levels 2-4:**

- Normal: **~3.5 seconds** to cross the maze.
- Eating dots: **~4 seconds**.

The speed table is actually applied each frame — Pac-Man visibly moves faster at Level 2 than at Level 1. *(manual)*

---

## Tier 3 — Levels 5-20

All of Tier 2, plus per-level scaling for Levels 5-20.

- The `pacmanSpeed` table has distinct entries for `level` 5-20, different from Levels 2-4.

**Pac-Man speed at Levels 5-20:**

- Normal: **~3 seconds** to cross the maze.
- Eating dots: **~3.5 seconds**.

Pac-Man visibly moves faster at Level 5+ than at Level 4. *(manual)*

---

## Tier 4 — Levels 21+ (no regression, run to 255)

All of Tier 3, plus the Level 21+ regression and the end-of-run handling.

- The `pacmanSpeed` table has a `level` 21+ entry that matches the Level 2-4 row (regression to slower).
- The game runs cleanly through Levels 21 to 255 with no crashes or stalls. *(manual)*
- Clearing `level === 255` ends the run with a final-screen overlay. The game does NOT advance to a Level 256. *(manual)*
- No earlier-tier feature has regressed. Pac-Man movement, wall collision, dot/pellet eating, win condition, level transitions, HUD, `score` and high score all still work as they did at Tier 1-3.

**Pac-Man speed at Levels 21+:**

- Normal: **~3.5 seconds** to cross the maze (same as Levels 2-4).
- Eating dots: **~4 seconds**.

Pac-Man visibly slows down going from Level 20 to Level 21. *(manual)*
