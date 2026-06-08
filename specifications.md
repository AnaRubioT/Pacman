# Pac-Man Specification

A shared background reference for the four rubrics (`rubrics/core.md`, `rubrics/ghost-ai.md`, `rubrics/powerups.md`, `rubrics/progression.md`). Each rubric grades its own slice of these behaviors at four tiers — Level 1, Levels 2-4, Levels 5-20, Levels 21+. This file defines the gameplay in plain language. The rubrics are what get checked.

---

## 1. The game

Pac-Man is a maze chase game. The player moves a yellow Pac-Man through a fixed maze, eating dots while avoiding four ghosts. Eating a power pellet briefly makes the ghosts vulnerable. Clearing all the dots advances to the next level. Losing all lives ends the game.

Levels run from 1 to 255. The maze layout, four ghosts, and core mechanics are the same at every level. What changes between levels is **speed** (Pac-Man, ghosts, frightened ghosts, tunnel speeds) and **scoring details** (bonus fruit type and points, frightened mode duration). The game gets harder because everyone moves faster and the safe windows shrink — not because the maze itself changes.

After Level 255, the run ends with a final-screen overlay. There is no Level 256.

---

## 2. Screen

The game renders to a tall browser canvas. The screen has three stacked regions:

- **Top HUD strip** — score, high score, "1UP" label.
- **Maze area** — the main playfield. Walls, dots, power pellets, ghost house, Pac-Man, ghosts, fruit. The "READY!" and "GAME OVER" overlays appear centered here when active.
- **Bottom HUD strip** — lives counter (small yellow Pac-Man icons), fruit history (small fruit icons from the recent levels).

HUD text never overlaps the maze. The three regions are visibly separate.

---

## 3. Colors

| Element | Color |
|---|---|
| Pac-Man | Yellow |
| Blinky (red ghost) | Red |
| Pinky (pink ghost) | Pink |
| Inky (cyan ghost) | Cyan |
| Clyde (orange ghost) | Orange |
| Ghost eye whites | White |
| Ghost pupils | Blue |
| Frightened ghost body | Dark blue |
| Frightened ghost during warning flash | White |
| Maze walls | Dark blue |
| Background | Black |
| Dots and power pellets | Peach / cream |
| Ghost-house gate | Pink |
| HUD text | White or yellow |

---

## 4. The maze

The maze is fixed, hand-coded, symmetric left-to-right. Not procedurally generated. The same maze on every level.

The maze contains:

- A network of corridors and walls in the iconic Pac-Man pattern. Each corridor is one tile wide, separated by walls.
- Approximately **240 small dots** along the corridors.
- Exactly **4 power pellets**, one near each of the four corners of the maze interior. Power pellets flash.
- A **ghost house** chamber in the center, enclosed by walls on three sides and a **pink gate** on top. Pac-Man cannot pass through the gate; ghosts can.
- A horizontal **side tunnel** through the middle. Crossing one edge of the tunnel reappears on the opposite edge.
- All open corridors are **fully connected**: every walkable tile is reachable from every other walkable tile, except the ghost-house interior, which is reachable only through the gate.

---

## 5. Pac-Man

Pac-Man is the player character: a yellow circle with an animated opening mouth that points in his direction of travel.

He starts each life on the wide horizontal corridor just below the ghost house, facing left. He does not move until the player presses an arrow key (or the "READY!" overlay times out).

**Controls.** The player presses arrow keys (or WASD). Pressing a direction key sets Pac-Man's *desired* direction. If the desired direction is blocked by a wall, Pac-Man continues in his current direction and remembers the desired direction; he turns into it at the first intersection where it becomes legal. A single key press is enough — Pac-Man keeps moving in his current direction until he hits a wall or the player presses a different arrow key.

**Walls.** Pac-Man cannot pass through walls. If his current direction runs into a wall, he stops at the wall.

**Pac-Man's speed by state and level range.** Speeds are given as the **approximate time to cross the maze** (about 28 tiles in a clear straight corridor):

| State | Level 1 | Levels 2-4 | Levels 5-20 | Levels 21+ |
|---|---|---|---|---|
| Normal (clear corridor) | ~4 sec | ~3.5 sec | ~3 sec | ~3.5 sec |
| Eating a row of dots | ~4.5-5 sec | ~4 sec | ~3.5 sec | ~4 sec |
| Energized (power pellet active) | ~3.5 sec | ~3.2 sec | ~3 sec | (n/a — no frightened) |
| Energized + eating dots | ~4 sec | ~3.7 sec | ~3.5 sec | (n/a) |

The dot-eating slow-down reflects Pac-Man briefly pausing as he consumes each dot. The energized state applies while frightened mode is active (see §7). At Levels 17, 19, 20, 21+ frightened does not happen, so the energized columns don't apply.

**Death animation.** When Pac-Man is caught by a non-frightened ghost, his mouth opens progressively wider until he vanishes (about 1.5 seconds).

---

## 6. The four ghosts

Four ghosts exist: **Blinky** (red, aggressive — chases directly), **Pinky** (pink, ambusher — targets ahead of Pac-Man), **Inky** (cyan, unpredictable — uses Pac-Man + Blinky positions), **Clyde** (orange, bashful — chases when far, retreats when close).

### 6.1 Modes

A ghost is always in one of these modes:

- **Chase** — pursuing its target tile.
- **Scatter** — heading toward its assigned corner.
- **Frightened** — slowed, blue, random direction. Eatable by Pac-Man.
- **Eaten** — drawn as eyes only, returning to the ghost house.
- **In-house** — inside the chamber, bouncing until released.

### 6.2 Chase targets

- **Blinky** targets Pac-Man's current tile.
- **Pinky** targets the tile 4 tiles ahead of Pac-Man in his current direction.
- **Inky** targets a point computed from both Pac-Man's tile (2 tiles ahead) and Blinky's tile — doubled vector flip.
- **Clyde** targets Pac-Man's tile when he is ≥ 8 tiles away, switches to his scatter corner when < 8 tiles away.

### 6.3 Scatter corners

- Blinky → top-right
- Pinky → top-left
- Inky → bottom-right
- Clyde → bottom-left

The corners are placed outside the navigable maze, so the ghosts can never actually reach them — they circle the corner area instead.

### 6.4 Direction selection at intersections

A ghost decides its next direction **once** per tile transition (when it enters a new tile). Between tile transitions, the direction is locked. At each tile entry:

1. List the legal directions (open corridors, not walls).
2. Exclude the direction directly opposite — ghosts cannot reverse on their own.
3. Pick the direction whose next tile is closest in straight-line distance to the ghost's current target tile.
4. Tie-break in order: **up, left, down, right**.

The only event that forces a reversal is a global mode-timer transition (scatter↔chase or *→frightened). Returning from frightened does not reverse direction.

### 6.5 Red zones (no upward turns)

At four specific tiles in the maze (two above the ghost house, two in the lower middle), ghosts in chase or scatter mode cannot turn upward. Frightened and eaten ghosts ignore the rule. Pac-Man is unaffected.

### 6.6 Scatter / chase mode timer

A global timer alternates all four ghosts between scatter and chase. Phase durations:

| Phase | Level 1 | Levels 2-4 | Levels 5-255 |
|---|---|---|---|
| Scatter 1 | 7 sec | 7 sec | 5 sec |
| Chase 1 | 20 sec | 20 sec | 20 sec |
| Scatter 2 | 7 sec | 7 sec | 5 sec |
| Chase 2 | 20 sec | 20 sec | 20 sec |
| Scatter 3 | 5 sec | 5 sec | 5 sec |
| Chase 3 | 20 sec | very long | very long |
| (after Chase 3, the game stays in chase indefinitely) |

Every scatter↔chase transition forces every active ghost to reverse direction once. Frightened mode pauses the timer; it resumes when frightened ends.

### 6.7 Ghost speeds by state and level range

Speeds as approximate time to cross the maze:

| State | Level 1 | Levels 2-4 | Levels 5-20 | Levels 21+ |
|---|---|---|---|---|
| Chase / scatter (clear corridor) | ~5.5 sec | ~4.5 sec | ~3.5 sec | ~3.5 sec |
| In tunnel | ~9-10 sec | ~7-8 sec | ~6-7 sec | ~6-7 sec |
| Frightened | ~9 sec | ~7 sec | ~5.5 sec | (n/a) |
| Eaten (eyes returning home) | ~2-2.5 sec | ~2-2.5 sec | ~2-2.5 sec | ~2-2.5 sec |

Pac-Man at Level 1 (~4 sec) is slightly faster than a chasing ghost (~5.5 sec), which is what lets him outrun a single ghost in a straight corridor. By Level 5 they are about equal in a corridor, and dot-eating slows Pac-Man enough that a chasing ghost catches up.

### 6.8 Ghost house emergence

Pinky always leaves the chamber immediately at level start. Inky and Clyde wait a level-dependent number of dots:

- Level 1: Inky waits 30 dots, Clyde waits 60 dots.
- Level 2: Inky leaves immediately, Clyde waits 50 dots.
- Level 3+: all three leave immediately.

If Pac-Man stops eating dots for too long, a timer force-releases the next waiting ghost (4 seconds at Levels 1-4, 3 seconds from Level 5).

After Pac-Man dies, a global counter governs ghost release: Pinky leaves at 7 dots, Inky at 17, Clyde at 32. Once Clyde leaves, the personal-counter rule resumes.

When a ghost is eaten by Pac-Man, its eyes return to the chamber, briefly bounce, and re-emerge as a normal ghost.

---

## 7. Power pellets and frightened mode

There are 4 power pellets, one near each corner of the maze interior.

**On eating a power pellet:**

1. Score increases by 50.
2. All ghosts not currently eaten and not in-house enter **frightened** mode: they slow down, reverse direction once, and render in dark blue.
3. The global scatter/chase timer pauses.

**Frightened mode behavior.** Ghosts move at their frightened speed (§6.7), pick random directions at intersections, and Pac-Man can eat them. Each successive ghost eaten during a single power-pellet activation is worth more:

| Successive eat | Points |
|---|---|
| 1st | 200 |
| 2nd | 400 |
| 3rd | 800 |
| 4th | 1,600 |

Eating an eaten ghost (eyes) is not possible; they're already returning home.

**Frightened mode duration by level range.** Frightened lasts longer at low levels, shorter at high levels:

| Level | Frightened duration | Warning flashes |
|---|---|---|
| 1 | 6 sec | 5 |
| 2 | 5 sec | 5 |
| 3 | 4 sec | 5 |
| 4 | 3 sec | 5 |
| 5, 7, 8, 11 | 2 sec | 5 |
| 6, 10 | 5 sec | 5 |
| 9, 12, 13, 15, 16, 18 | 1 sec | 3 |
| 14 | 3 sec | 5 |
| 17, 19, 20, 21+ | **0 sec — no frightened mode at all** | — |

When frightened seconds is 0 (Levels 17, 19, 20, 21+), eating a power pellet still awards 50 points but does not change ghost state. The global timer is not paused and the ghosts are never eatable.

Near the end of the duration, the frightened sprite alternates between dark blue and white (the warning flash). The number of flashes is in the table above.

When the duration expires, all still-frightened ghosts return to whichever mode the global timer indicates (chase or scatter). They do NOT reverse direction on that transition.

---

## 8. Cruise Elroy

When the remaining dots drop below level-specific thresholds, Blinky enters **Cruise Elroy** mode — he gets faster and starts targeting Pac-Man's tile even during scatter phases.

Two stages:

- **Elroy 1** — first activation. Blinky moves slightly faster than his normal level speed, and starts chasing during scatter.
- **Elroy 2** — at a lower dot threshold. Blinky moves faster still — past Pac-Man's speed at most levels.

Thresholds and speeds by level:

| Level | Elroy 1 trigger (dots left) | Elroy 1 speed (cross time) | Elroy 2 trigger | Elroy 2 speed |
|---|---|---|---|---|
| 1 | 20 dots | ~4 sec (matches Pac-Man L1) | 10 dots | ~3.5 sec (faster than Pac-Man L1) |
| 2-4 | 30-40 dots | ~3.5 sec | 15-20 dots | ~3.2 sec |
| 5-20 | 40-100 dots | ~3 sec | 20-50 dots | ~2.8 sec |
| 21+ | 120 dots | ~3 sec | 60 dots | ~2.8 sec |

After Pac-Man dies, Cruise Elroy is suspended until Clyde leaves the ghost house. Then Elroy resumes if the threshold is still met.

---

## 9. Scoring

| Action | Points |
|---|---|
| Eat a dot | 10 |
| Eat a power pellet | 50 |
| Eat a frightened ghost (combo) | 200 / 400 / 800 / 1,600 |
| Eat a bonus fruit | varies by level — see §10 |

**Bonus life.** The player earns one extra life when the score crosses **10,000 points**. Awarded at most once per run.

**High score.** Persists across page reloads. Shown alongside the current score in the HUD. Updated at game-over if the current score beats the previous high.

---

## 10. Bonus fruit

A bonus fruit appears at a fixed spot just below the ghost house at two moments in each level: after Pac-Man has eaten 70 dots, and again after 170 dots. Each fruit stays on screen for 9-10 seconds (randomly chosen), then disappears. The fruit is stationary.

Fruit type and points by level:

| Level(s) | Fruit | Points |
|---|---|---|
| 1 | Cherries | 100 |
| 2 | Strawberry | 300 |
| 3-4 | Peach (orange) | 500 |
| 5-6 | Apple | 700 |
| 7-8 | Grapes (melon) | 1,000 |
| 9-10 | Galaxian | 2,000 |
| 11-12 | Bell | 3,000 |
| 13 and beyond | Key | 5,000 |

When eaten, the fruit's point value briefly appears at its position. A small fruit history row at the bottom of the HUD shows the icons for the most recent levels' fruits (up to 7).

---

## 11. Lives, death, level transitions

The player starts with **3 lives**.

**On death.** All ghosts freeze briefly, Pac-Man plays his death animation (~1.5 sec), one life is deducted. If lives remain, the level resets to its starting positions (without re-filling the dots already eaten) and the global mode timer restarts at scatter 1. If no lives remain, GAME OVER.

**On level clear.** When the last pickup is eaten:

1. Maze walls flash blue/white for ~2 seconds.
2. If the cleared level is 2, 5, 9, 13, or 17, an intermission cutscene plays (§12).
3. Level number advances by one. Maze refills. Entities reset. New level's per-level values (speeds, frightened duration, fruit, Elroy thresholds) apply.

**On Level 255 cleared.** Run ends with a final-screen overlay congratulating the player. The game does not continue past Level 255.

---

## 12. Intermissions

Short cutscenes play between specific levels (gameplay paused, HUD visible):

- **After Level 2 — Act I** (~9 sec): Pac-Man and Blinky chase each other across the screen.
- **After Level 5 — Act II** (~10 sec): Blinky's sheet snags on a nail and tears.
- **After Levels 9, 13, 17 — Act III** (~5 sec): Blinky walks across with his torn sheet.

No intermissions after any other level.

---

## 13. Per-level summary (one-page reference)

| Level | Pac-Man cross | Ghost cross | Frightened sec | Fruit | Fruit pts | Intermission |
|---|---|---|---|---|---|---|
| 1 | ~4 sec | ~5.5 sec | 6 | Cherry | 100 | — |
| 2 | ~3.5 sec | ~4.5 sec | 5 | Strawberry | 300 | Act I |
| 3 | ~3.5 sec | ~4.5 sec | 4 | Peach | 500 | — |
| 4 | ~3.5 sec | ~4.5 sec | 3 | Peach | 500 | — |
| 5 | ~3 sec | ~3.5 sec | 2 | Apple | 700 | Act II |
| 6 | ~3 sec | ~3.5 sec | 5 | Apple | 700 | — |
| 7-8 | ~3 sec | ~3.5 sec | 2 | Grapes | 1,000 | — |
| 9 | ~3 sec | ~3.5 sec | 1 | Galaxian | 2,000 | Act III |
| 10 | ~3 sec | ~3.5 sec | 5 | Galaxian | 2,000 | — |
| 11-12 | ~3 sec | ~3.5 sec | 2 / 1 | Bell | 3,000 | — |
| 13 | ~3 sec | ~3.5 sec | 1 | Key | 5,000 | Act III |
| 14 | ~3 sec | ~3.5 sec | 3 | Key | 5,000 | — |
| 15-16 | ~3 sec | ~3.5 sec | 1 | Key | 5,000 | — |
| 17 | ~3 sec | ~3.5 sec | **0** | Key | 5,000 | Act III |
| 18 | ~3 sec | ~3.5 sec | 1 | Key | 5,000 | — |
| 19-20 | ~3 sec | ~3.5 sec | **0** | Key | 5,000 | — |
| 21-255 | ~3.5 sec | ~3.5 sec | **0** | Key | 5,000 | — |

Invariants across all levels: dot value 10, power pellet 50, ghost combo 200/400/800/1,600, bonus life at 10,000, starting lives 3, maze layout, ghost AI formulas, scatter corners, red zones, intermission set.
