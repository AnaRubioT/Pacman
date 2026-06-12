# Rubric: GHOST_AI

**Covers:** the four ghosts, their distinct chase targets, the global scatter/chase mode timer, red zones, ghost-house emergence, ghost speeds (chase/scatter + tunnel) across all level ranges.

The score is the highest tier whose checklist is *fully* satisfied. Items marked `*(manual)*` need visual verification; they do not block tier progression automatically.

Ghost speeds are stated as **approximate time to cross the maze**. The manual playtest is what confirms the speed feels right.

---

## Tier 1 — Level 1 baseline

Four ghosts present, each with a distinct chase target function, walls respected, basic direction selection.

- The code defines four `ghosts`: `blinky`, `pinky`, `inky`, `clyde`.
- Ghost body colors `#ff0000`, `#ffb8ff`, `#00ffff`, `#ffb852` appear in code.
- Ghosts start at their assigned positions inside or above the ghost-house chamber. *(manual)*
- All four ghosts respect walls — none can pass through wall tiles. *(manual)*
- The ghost direction selection is gated by a tile-center check (`atTileCenter` or equivalent) so direction is set once per tile entry.
- The code excludes the reverse direction (an `opp` map or filter excluding the opposite `dir`).
- Each ghost has its own chase target function — the four ghosts behave differently from each other. *(manual)*
- `blinky` target = `pacman` tile (Blinky chases Pac-Man directly).
- `pinky` target uses the literal `4` to look ahead of Pac-Man.
- `inky` has its own target formula, distinct from Blinky's and Pinky's.
- `clyde` has a distance-based switch between chasing Pac-Man and retreating.
- Random direction selection is NOT used in CHASE mode. *(manual)*
- Pac-Man colliding with a non-frightened ghost has consequence (life lost, game over, or reset). *(manual)*
- The code uses `ghost.speed` (or similar) for ghost movement speed.

**Ghost speeds at Level 1 (per spec §6.7):**

| State | Time to cross maze |
|---|---|
| Chase / scatter (clear corridor) | ~5.5 sec |
| Eaten (eyes returning home) | ~2-2.5 sec |

Ghosts are visibly slower than Pac-Man in a corridor at Level 1, and much faster when returning as eyes. *(manual)*

---

## Tier 2 — Levels 2-4

All of Tier 1, plus the arcade-accurate AI structure (scatter/chase mode timer, ghost-house emergence, scatter corners) and per-level scaling for Levels 2-4.

- Each ghost has a defined scatter corner: Blinky top-right, Pinky top-left, Inky bottom-right, Clyde bottom-left. The four corner targets are observable in code.
- `inky` target code references `blinky` — Inky uses Blinky's position in its formula.
- `clyde` target uses the literal `8` as the distance switch between chasing and retreating.
- Tie-breaking preference order: **up, left, down, right**.
- A global mode timer runs the Level-1 sequence: `[7, 20, 7, 20, 5, 20, 5]` seconds — the literals `7` and `20` appear in code.
- Every scatter↔chase transition forces every active ghost to reverse direction once. *(manual)*
- Ghost-house emergence: `inky` exits after Pac-Man has eaten `30` dots. `clyde` exits after `60` dots.
- A no-dot release timer at `4` seconds fires when Pac-Man stops eating.
- After Pac-Man dies, a global counter releases ghosts at `7`, `17`, `32` dots.
- A `ghostSpeed` table is indexed by `level`; Levels 2-4 values differ from Level 1.
- A tunnel-speed branch slows ghosts in the side tunnel.
- The mode-timer Levels 2-4 row has a very long chase 3 phase.

**Ghost speeds at Levels 2-4:**

| State | Time to cross maze |
|---|---|
| Chase / scatter | ~4.5 sec |
| In tunnel | ~7-8 sec |

Ghosts visibly move faster at Level 2 than at Level 1. *(manual)*

---

## Tier 3 — Levels 5-20

All of Tier 2, plus per-level scaling for Levels 5-20, red zones, and Cruise Elroy interactions (Elroy itself lives in PROGRESSION, but the speed-up effect on Blinky should be visible here).

- The `ghostSpeed` table has distinct entries for `level` 5-20.
- A red-zone "no upward turn" rule is implemented at four specific tiles. Ghosts in chase or scatter mode at these tiles cannot select "up". Frightened and eaten ghosts ignore the rule.
- The no-dot release timer drops to `3` seconds at Level 5+.
- The mode-timer Levels 5+ row applies: `[5, 20, 5, 20, 5, very-long, ...]`.

**Ghost speeds at Levels 5-20:**

| State | Time to cross maze |
|---|---|
| Chase / scatter | ~3.5 sec |
| In tunnel | ~6-7 sec |

Ghosts at Level 5+ are about the same speed as Pac-Man in a clear corridor, so Pac-Man can no longer outrun a single ghost without help from dot-spacing or tunnels. *(manual)*

---

## Tier 4 — Levels 21+ (no regression, run to 255)

All of Tier 3. The Level 21+ row of the ghost speed table is present and matches the Levels 5-20 values (no further regression in ghost speed; they stay fast).

- The `ghostSpeed` table has a Levels 21+ entry. The values are the same as Levels 5-20 (ghosts do NOT slow down at Level 21).
- The game runs cleanly through Levels 21 to 255 with ghosts still moving, AI still working, ghost-house emergence still firing as expected. *(manual)*
- No earlier-tier feature has regressed. The four named ghosts, distinct chase formulas, mode timer, forced reversals, red zones, and ghost-house emergence rules all still work.

**Ghost speeds at Levels 21+:** same as Levels 5-20. Manual playtest confirms ghosts continue to threaten Pac-Man at the late levels.
