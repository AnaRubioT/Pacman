# Rubric: GHOST_AI

**Covers:** the four ghosts, their distinct chase targets, the global scatter/chase mode timer, red zones, ghost-house emergence, ghost speeds (chase/scatter + tunnel) across all level ranges.

The score is the highest tier whose checklist is *fully* satisfied. Items marked `*(manual)*` need visual verification; they do not block tier progression automatically.

Ghost speeds are stated as **approximate time to cross the maze**. The manual playtest is what confirms the speed feels right.

---

## Tier 1 — Level 1 baseline

Four ghosts present, each with a distinct chase target function, walls respected, basic direction selection.

- Exactly **four** ghost entities exist, identifiable in code as Blinky, Pinky, Inky, Clyde (by class name, instance name, color tag, or comparable identifier).
- Each ghost has the correct body color: Blinky red, Pinky pink, Inky cyan, Clyde orange. The hex codes `#ff0000`, `#ffb8ff`, `#00ffff`, `#ffb852` (or the word names) appear in code.
- Ghosts start at their assigned positions inside or above the ghost-house chamber. *(manual)*
- All four ghosts respect walls — none can pass through wall tiles. *(manual)*
- At each tile transition, a ghost selects its next direction (locked between transitions, not recomputed every frame).
- The **no-reverse rule** is enforced: in the direction-selection code, the direction opposite the ghost's current travel is excluded from candidates.
- Each ghost has its own chase-target function — the four ghosts behave differently from each other. *(manual — confirm by watching their paths)*
  - **Blinky:** target = Pac-Man's current tile.
  - **Pinky:** target = some number of tiles ahead of Pac-Man. The literal `4` (or a named look-ahead constant) appears in Pinky's target code.
  - **Inky:** has its own target formula, distinct from Blinky's and Pinky's.
  - **Clyde:** has a distance-based switch between chasing Pac-Man and retreating.
- Direction selection picks the direction that minimizes distance to the current target tile.
- Random direction selection is NOT used in CHASE mode. *(manual — confirm ghosts behave differently from each other)*
- Pac-Man colliding with a non-frightened ghost has consequence (life lost, game over, or reset). *(manual)*
- A ghost speed constant or variable exists in code (any reasonable value — does not need to vary by level yet).

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
- **Inky's** target code references Blinky's identifier — Inky's formula uses both Pac-Man's and Blinky's positions.
- **Clyde's** target code uses a literal `8` (or a constant of that value) as the distance switch between chasing Pac-Man and retreating to his scatter corner.
- Tie-breaking preference order: **up, left, down, right**.
- A **global scatter/chase mode timer** drives all four ghosts. The Level-1 phase sequence is `[scatter 7s, chase 20s, scatter 7s, chase 20s, scatter 5s, chase 20s, scatter 5s, chase indefinite]`. The literals `7` and `20` appear in code.
- Every scatter↔chase transition forces every active ghost to reverse direction once. *(manual)*
- **Ghost-house emergence at Level 1:** Inky exits after Pac-Man has eaten **30 dots** (the literal `30` appears). Clyde exits after **60 dots** (the literal `60` appears).
- A **no-dot timer** at **4 seconds** force-releases the next waiting ghost if Pac-Man stops eating. The literal `4` appears in seconds form.
- After Pac-Man dies, a global counter releases ghosts at Pinky=7, Inky=17, Clyde=32 dots. The literals `7`, `17`, `32` appear.
- Ghost speed table indexed by `level` is defined; Levels 2-4 values differ from Level 1.
- A tunnel-speed branch exists; ghosts slow down in the side tunnel.
- The mode-timer phase durations for Levels 2-4 are observable. The third chase phase is much longer than at Level 1 (any "very long" value is acceptable).

**Ghost speeds at Levels 2-4:**

| State | Time to cross maze |
|---|---|
| Chase / scatter | ~4.5 sec |
| In tunnel | ~7-8 sec |

Ghosts visibly move faster at Level 2 than at Level 1. *(manual)*

---

## Tier 3 — Levels 5-20

All of Tier 2, plus per-level scaling for Levels 5-20, red zones, and Cruise Elroy interactions (Elroy itself lives in PROGRESSION, but the speed-up effect on Blinky should be visible here).

- Ghost speed table has distinct Levels 5+ values, different from Levels 2-4.
- **Red-zone "no upward turn" rule** is implemented at four specific tiles (two above the ghost house, two in the lower middle). Ghosts in chase or scatter mode at these tiles cannot select "up". Frightened and eaten ghosts ignore the rule.
- No-dot timer drops to **3 seconds** at Level 5+. The literal `3` appears in a per-level branching.
- The global mode timer applies the Levels 5+ row of durations (`[scatter 5s, chase 20s, scatter 5s, chase 20s, scatter 5s, chase very-long, ...]`).

**Ghost speeds at Levels 5-20:**

| State | Time to cross maze |
|---|---|
| Chase / scatter | ~3.5 sec |
| In tunnel | ~6-7 sec |

Ghosts at Level 5+ are about the same speed as Pac-Man in a clear corridor, so Pac-Man can no longer outrun a single ghost without help from dot-spacing or tunnels. *(manual)*

---

## Tier 4 — Levels 21+ (no regression, run to 255)

All of Tier 3. The Level 21+ row of the ghost speed table is present and matches the Levels 5-20 values (no further regression in ghost speed; they stay fast).

- Ghost speed table has a Levels 21+ row. The values are the same as Levels 5-20 (ghosts do NOT slow down at Level 21 the way Pac-Man does).
- The game runs cleanly through Levels 21 to 255 with ghosts still moving, AI still working, ghost-house emergence still firing as expected. *(manual)*
- No earlier-tier feature has regressed. The four named ghosts, distinct chase formulas, mode timer, forced reversals, red zones, and ghost-house emergence rules all still work.

**Ghost speeds at Levels 21+:** same as Levels 5-20. Manual playtest confirms ghosts continue to threaten Pac-Man at the late levels.
