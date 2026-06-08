# Rubric: GHOST_AI

**Covers:** the four ghosts, their distinct chase targets, the global scatter/chase mode timer, red zones, ghost-house emergence, ghost speeds (chase/scatter + tunnel) across all level ranges.

The score is the highest tier whose checklist is *fully* satisfied. Items marked `*(manual)*` need visual verification; they do not block tier progression automatically.

Ghost speeds are stated as **approximate time to cross the maze**. The manual playtest is what confirms the speed feels right.

---

## Tier 1 — Level 1 baseline

Four ghosts present, distinct AI per ghost, scatter/chase mode timer working at Level 1 durations, ghost-house emergence rule for Level 1.

- Exactly **four** ghost entities exist, identifiable in code as Blinky, Pinky, Inky, Clyde (by class name, instance name, color tag, or comparable identifier). *(static)*
- Each ghost has the correct body color: Blinky red, Pinky pink, Inky cyan, Clyde orange. *(static; verified by hex code OR word name)*
- Blinky starts OUTSIDE the ghost-house chamber, on the tile immediately above the pink gate. Pinky, Inky, Clyde start INSIDE the chamber. *(manual)*
- All four ghosts respect walls — none can pass through wall tiles. The pink gate is passable for ghosts only. *(manual)*
- At each tile transition, a ghost selects its next direction ONCE (locked between transitions, not recomputed every frame). *(static — look for the tile-entry guard)*
- The **no-reverse rule** is enforced: in the direction-selection code, the direction opposite the ghost's current travel is excluded from candidates. *(static)*
- Each ghost computes a distinct chase-mode target tile (per spec §6.2):
  - **Blinky:** target = Pac-Man's current tile. *(static)*
  - **Pinky:** target = 4 tiles ahead of Pac-Man in his direction. The literal `4` or a named look-ahead constant appears in Pinky's target code. *(static)*
  - **Inky:** target uses BOTH Pac-Man's and Blinky's positions. A reference to Blinky's identifier appears inside Inky's target computation. *(static)*
  - **Clyde:** target switches between Pac-Man's tile and Clyde's scatter corner based on an 8-tile distance check. The literal `8` (or a constant of that value) appears in Clyde's target code. *(static)*
- Direction selection minimizes Euclidean (or Manhattan) distance to the current target tile. *(static / partial)*
- Tie-breaking preference order: **up, left, down, right**. *(static / partial)*
- Random direction selection is NOT used in CHASE mode. *(manual — confirm ghosts behave differently from each other)*
- Each ghost has a defined scatter corner: Blinky top-right, Pinky top-left, Inky bottom-right, Clyde bottom-left. *(static — corner targets observable in code)*
- A **global scatter/chase mode timer** drives all four ghosts. The Level-1 phase sequence is `[scatter 7s, chase 20s, scatter 7s, chase 20s, scatter 5s, chase 20s, scatter 5s, chase indefinite]`. The literals `7` and `20` appear in code. *(static)*
- Every scatter↔chase transition forces every active ghost to reverse direction once. *(manual — confirm visible reversal at the 7s mark)*
- Pac-Man colliding with a non-frightened ghost has consequence (life lost, game over, or reset). *(manual)*

**Ghost-house emergence at Level 1:**

- Blinky: outside at start.
- Pinky: exits immediately.
- Inky: exits after Pac-Man has eaten **30 dots**. The literal `30` appears in code. *(static)*
- Clyde: exits after Pac-Man has eaten **60 dots**. The literal `60` appears in code. *(static)*
- After Pac-Man dies, a global counter releases ghosts at Pinky=7, Inky=17, Clyde=32 dots. *(static — literals 7, 17, 32 appear)*
- A no-dot timer at **4 seconds** force-releases the next waiting ghost if Pac-Man stops eating. *(static — literal 4 appears in seconds form)*

**Ghost speeds at Level 1 (per spec §6.7):**

| State | Time to cross maze |
|---|---|
| Chase / scatter (clear corridor) | ~5.5 sec |
| In tunnel | ~9-10 sec |
| Eaten (eyes returning home) | ~2-2.5 sec |

A Level-1 ghost speed constant or table is observable in code. *(static)* Ghosts are visibly slower than Pac-Man in a corridor at Level 1, much slower in the tunnel, and much faster when returning as eyes. *(manual)*

---

## Tier 2 — Levels 2-4

All of Tier 1, plus per-level scaling for Levels 2-4 and the longer chase-3 phase.

- Ghost speed table indexed by `level` is defined; Levels 2-4 values differ from Level 1. *(static)*
- The mode-timer phase durations for Levels 2-4 are observable in code. The third chase phase is much longer than at Level 1 (over 17 minutes in arcade — any "very long" value is acceptable). *(static)*
- Ghost-house emergence at Levels 2+: Inky leaves immediately at Level 2. Clyde waits **50 dots** at Level 2, then 0 from Level 3+. *(static — literal 50 appears)*
- No-dot timer drops to **3 seconds** at Level 5+ (state the threshold; this is a Tier-3 manual check). For Tier 2 it remains 4 sec.

**Ghost speeds at Levels 2-4:**

| State | Time to cross maze |
|---|---|
| Chase / scatter | ~4.5 sec |
| In tunnel | ~7-8 sec |

Ghosts visibly move faster at Level 2 than at Level 1. *(manual)*

---

## Tier 3 — Levels 5-20

All of Tier 2, plus per-level scaling for Levels 5-20, red zones, and Cruise Elroy interactions (Elroy itself lives in PROGRESSION, but the speed-up effect on Blinky should be visible here).

- Ghost speed table has distinct Levels 5+ values, different from Levels 2-4. *(static)*
- **Red-zone "no upward turn" rule** is implemented at four specific tiles (two above the ghost house, two in the lower middle). Ghosts in chase or scatter mode at these tiles cannot select "up". Frightened and eaten ghosts ignore the rule. *(static — look for the red-zone exclusion gated on ghost mode)*
- No-dot timer drops to **3 seconds** at Level 5+. *(static — literal 3 appears in a per-level branching)*
- The global mode timer applies the Levels 5+ row of durations (`[scatter 5s, chase 20s, scatter 5s, chase 20s, scatter 5s, chase very-long, ...]`). *(static)*

**Ghost speeds at Levels 5-20:**

| State | Time to cross maze |
|---|---|
| Chase / scatter | ~3.5 sec |
| In tunnel | ~6-7 sec |

Ghosts at Level 5+ are about the same speed as Pac-Man in a clear corridor, so Pac-Man can no longer outrun a single ghost without help from dot-spacing or tunnels. *(manual)*

---

## Tier 4 — Levels 21+ (no regression, run to 255)

All of Tier 3. The Level 21+ row of the ghost speed table is present and matches the Levels 5-20 values (no further regression in ghost speed; they stay fast).

- Ghost speed table has a Levels 21+ row. The values are the same as Levels 5-20 (ghosts do NOT slow down at Level 21 the way Pac-Man does). *(static)*
- The game runs cleanly through Levels 21 to 255 with ghosts still moving, AI still working, ghost-house emergence still firing as expected. *(manual)*
- No earlier-tier feature has regressed. The four named ghosts, distinct chase formulas, mode timer, forced reversals, red zones, and ghost-house emergence rules all still work.

**Ghost speeds at Levels 21+:** same as Levels 5-20. Manual playtest confirms ghosts continue to threaten Pac-Man at the late levels.
