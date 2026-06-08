# Rubric: POWERUPS

**Covers:** power pellets, frightened mode entry/behavior/exit, ghost-eat combo scoring, eaten-ghost return, end-of-frightened warning flash, per-level frightened duration, no-frightened levels, energized Pac-Man speed, frightened ghost speed, eaten (eyes) speed.

The score is the highest tier whose checklist is *fully* satisfied. Items marked `*(manual)*` need visual verification; they do not block tier progression automatically.

Speeds are stated as **approximate time to cross the maze**.

---

## Tier 1 — Level 1 baseline

Power pellets exist, frightened mode works end-to-end at Level 1 durations, combo scoring works, eaten ghosts return home.

- Four power pellets exist near the four corners of the maze interior. *(manual)*
- Power pellets are visually distinct from regular dots — larger, or flashing, or both. *(manual)*
- Eating a power pellet awards **50 points** and sets a `powerMode` (or `frightened`, or equivalent) flag to true. *(static — literal 50, and a flag identifier)*
- When the flag is true, ghost rendering changes — ghosts are drawn with a dark-blue frightened body (no whites, simple eyes and mouth). *(manual)*
- When the flag is true, ghosts at intersections pick a random legal direction (subject to the no-reverse rule). *(static — random call gated on the flag)*
- When the flag is true, ghosts move at their **frightened speed** (slower than normal — see speeds table below). *(static — frightened-speed branch in movement code)*
- On entering frightened mode, all non-eaten and non-in-house ghosts reverse direction once. *(manual — visible reversal)*
- The global scatter/chase timer pauses while the flag is true. *(static — observable pause logic)*
- The flag auto-expires after **6 seconds** at Level 1. The literal `6` appears in code near a frightened-related identifier. *(static)*
- During approximately the last 2 seconds, the frightened ghost sprite alternates between dark blue and white — the **warning flash**. The Level 1 flash count is **5**. *(manual — visible flash)*
- When Pac-Man collides with a frightened ghost: the ghost transitions to EATEN state, score increases by the combo value (see below), the ghost is drawn as eyes only and moves toward the ghost house. *(manual)*
- An eaten ghost re-enters the chamber, briefly bounces, and re-emerges as a normal ghost. The ghost is NOT deleted from the game. *(manual)*
- Combo scoring on successive eats during one power-pellet activation:

  | Successive eat | Points |
  |---|---|
  | 1st | 200 |
  | 2nd | 400 |
  | 3rd | 800 |
  | 4th | 1,600 |

  The array `[200, 400, 800, 1600]` (or equivalent doubling) is observable in code. A counter persists across eats within one activation and resets when the flag expires OR all 4 ghosts have been eaten. *(static + manual)*

**Speeds at Level 1 (per spec §5 and §6.7):**

| Entity / state | Time to cross maze |
|---|---|
| Pac-Man energized (clear corridor) | ~3.5 sec (slightly faster than his normal 4 sec) |
| Pac-Man energized + eating dots | ~4 sec |
| Frightened ghost | ~9 sec (much slower than normal 5.5 sec) |
| Eaten ghost (eyes returning home) | ~2-2.5 sec (much faster than any normal state) |

A speed constant or table is observable in code for each of these states. *(static)* Manual playtest: when the pellet fires, ghosts visibly slow down to a crawl, Pac-Man visibly speeds up slightly, and eaten ghosts streak back to the chamber. *(manual)*

---

## Tier 2 — Levels 2-4

All of Tier 1, plus per-level scaling for Levels 2-4.

- A frightened-duration table indexed by `level` is defined. Level 2 = **5 sec**, Level 3 = **4 sec**, Level 4 = **3 sec**. *(static)*
- A frightened-ghost speed table is defined; Levels 2-4 values differ from Level 1. *(static)*
- A Pac-Man energized speed table is defined; Levels 2-4 values differ from Level 1. *(static)*

**Speeds at Levels 2-4:**

| Entity / state | Time to cross maze |
|---|---|
| Pac-Man energized | ~3.2 sec |
| Frightened ghost | ~7 sec |
| Eaten ghost | ~2-2.5 sec (invariant across levels) |

Frightened mode visibly ends sooner at Level 2 than at Level 1. *(manual)*

---

## Tier 3 — Levels 5-20

All of Tier 2, plus per-level scaling for Levels 5-20 — including the levels where frightened mode duration drops to 1 second or doesn't occur.

- The frightened-duration table includes the Levels 5-20 entries. Examples: Level 5 = 2 sec, Level 6 = 5 sec, Level 9 = 1 sec (with 3 flashes), Level 14 = 3 sec, **Level 17 = 0 sec**. *(static — table values observable)*
- At **Level 17**, eating a power pellet awards 50 points but does NOT cause ghosts to enter frightened mode. The global timer is not paused, ghosts do not reverse, ghost rendering does not change. The `level` variable gates the frightened-mode trigger. *(static — branch on level; manual — confirm by playing Level 17)*
- The frightened ghost speed table includes Levels 5+ values, faster than Levels 2-4. *(static)*

**Speeds at Levels 5-20:**

| Entity / state | Time to cross maze |
|---|---|
| Pac-Man energized | ~3 sec |
| Frightened ghost | ~5.5 sec (frightened is now barely slower than chase) |
| Eaten ghost | ~2-2.5 sec |

At Level 5, frightened mode ends after a brief flash — Pac-Man has roughly 2 seconds to catch a ghost. *(manual)*

---

## Tier 4 — Levels 21+ (no regression, run to 255)

All of Tier 3. At Levels 21+, frightened mode is permanently disabled.

- The frightened-duration table has the Levels 19, 20, 21+ entries all at **0 seconds**. *(static)*
- At any Level 21+, eating a power pellet awards 50 points and does nothing else. Ghosts do not change state. The combo counter does not advance. *(manual — confirm by playing a Level 21+ run, or by inspecting that the level branch fires)*
- The game runs cleanly through Levels 21 to 255 with the power pellet behavior staying consistent (50-point pickup only). *(manual)*
- No earlier-tier feature has regressed. Eating a frightened ghost at Levels 1-16 / 18 still scales correctly through 200 / 400 / 800 / 1,600. Eaten ghosts still return as eyes and re-emerge. The warning flash still fires at the configured flash counts.
