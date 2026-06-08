# Rubric: PROGRESSION

**Covers:** level transitions, bonus fruit (type, points, spawn triggers, lifetime, fruit-history HUD), intermissions (cutscenes after Levels 2, 5, 9, 13, 17), Cruise Elroy (Blinky's late-level speed-up). Run-to-completion through Level 255.

The score is the highest tier whose checklist is *fully* satisfied. Items marked `*(manual)*` need visual verification; they do not block tier progression automatically.

Cruise Elroy speeds are stated as **approximate time to cross the maze**.

---

## Tier 1 — Level 1 baseline

A single-level game runs cleanly: Pac-Man can clear the maze, lose lives, win or game-over. No crashes or stalls during normal play.

- The game has Level 1 fully playable end-to-end — maze, Pac-Man, four ghosts, dots, power pellets, frightened mode. *(manual — confirmed by the rest of the rubrics' Tier 1)*
- The win condition fires when all Level-1 pickups are eaten, and a "YOU WIN" overlay (or equivalent) is shown. *(manual)*
- The lose condition fires when lives reach 0 and a "GAME OVER" overlay is shown. *(manual)*
- The game does not crash, hang, or infinite-loop during normal play. *(manual)*
- Pressing SPACE (or equivalent) restarts the game from Level 1 after game-over or win. *(manual)*

No Cruise Elroy, no fruit, no intermissions, no level-2 transition required at Tier 1.

---

## Tier 2 — Levels 2-4

All of Tier 1, plus multi-level progression starts working: Levels 2, 3, 4 are reachable. Cruise Elroy fires at Level 1 (it lives in this rubric). Bonus fruit appears for Levels 1-4. Intermission Act I plays between Levels 2 and 3.

### Level transitions

- On clearing a level, the maze walls flash for ~2 seconds, then the maze refills, entities reset to starting positions, the `level` variable increments by 1, and play resumes from the new level's "READY!" state. *(manual)*
- The new level's per-level values (speeds, frightened duration, fruit) apply once play resumes. *(manual — confirm Level 2 is visibly different from Level 1)*

### Bonus fruit (Levels 1-4)

- A bonus fruit spawns at a fixed tile just below the ghost house after Pac-Man has eaten **70 dots** in the current level. The literal `70` appears in code. *(static)*
- A second fruit spawns after **170 dots**. The literal `170` appears in code. *(static)*
- Each fruit stays on screen for **9-10 seconds** (randomized), then disappears if uneaten. *(static — literals 9/10 or a 9-10 random; manual to confirm timing)*
- Eating a fruit awards points based on a **per-level fruit table** indexed by level: Level 1 = Cherry / 100, Level 2 = Strawberry / 300, Levels 3-4 = Peach / 500. *(static — table values observable, literals 100, 300, 500 appear)*
- When eaten, the fruit's point value briefly appears at its position. *(manual)*
- A fruit history row at the bottom of the HUD shows icons for recent levels' fruits (up to 7 entries). The icons accumulate as levels progress. *(manual)*

### Cruise Elroy (active at all levels, primarily visible at Level 1 here)

- Blinky's speed increases when dots remaining drop below the Level 1 **Elroy 1 threshold (20 dots)**. The literal `20` appears in code with Blinky/Elroy context. *(static)*
- A second speed-up — **Elroy 2** — triggers below the Level 1 threshold (**10 dots**). The literal `10` appears. *(static)*
- While Elroy is active, Blinky's target tile is Pac-Man's tile EVEN during scatter phases. *(static — Blinky's scatter-corner is overridden; manual — confirm Blinky chases during scatter once Elroy fires)*
- After Pac-Man dies, Cruise Elroy is suspended until Clyde leaves the ghost house. *(manual)*

**Cruise Elroy speeds at Level 1:**

| Stage | Time to cross maze |
|---|---|
| Elroy 1 | ~4 sec (matches Pac-Man's Level 1 normal speed) |
| Elroy 2 | ~3.5 sec (faster than Pac-Man at Level 1) |

Once Elroy 2 fires, Blinky catches Pac-Man in any open corridor unless Pac-Man uses the tunnel or doubles back. *(manual)*

### Intermissions

- **Intermission Act I** plays between Level 2 cleared and Level 3 start. Duration about 9 seconds. Pac-Man and Blinky chase each other across the screen. *(manual)*
- During the intermission, gameplay input is disabled; HUD remains visible. *(manual)*
- The intermission trigger is gated on the cleared level number = 2. *(static — branch on level == 2; manual)*

---

## Tier 3 — Levels 5-20

All of Tier 2, plus per-level scaling for Levels 5-20 across fruit and Cruise Elroy, plus intermissions Act II and Act III.

### Bonus fruit (Levels 5-20)

The per-level fruit table includes Levels 5-20:

| Level(s) | Fruit | Points |
|---|---|---|
| 5-6 | Apple | 700 |
| 7-8 | Grapes (melon) | 1,000 |
| 9-10 | Galaxian | 2,000 |
| 11-12 | Bell | 3,000 |
| 13-20 | Key | 5,000 |

The literals 700, 1000, 2000, 3000, 5000 appear in the table code. *(static)*

### Cruise Elroy (Levels 5-20)

- The Elroy threshold table includes Levels 5-20 rows. Thresholds rise with level (more dots remaining when Elroy fires). *(static — table values observable)*
- Elroy speeds at Levels 5-20 are faster than at Levels 2-4. Blinky becomes a serious threat from Level 5 onward.

**Cruise Elroy speeds at Levels 5-20:**

| Stage | Time to cross maze |
|---|---|
| Elroy 1 | ~3 sec (matches Pac-Man's Level 5 normal speed) |
| Elroy 2 | ~2.8 sec (faster than Pac-Man at Level 5+) |

### Intermissions (Act II, Act III)

- **Act II** plays between Level 5 cleared and Level 6 start. Duration ~10 sec. Blinky's sheet snags on a nail. *(manual)*
- **Act III** plays between Level 9 cleared and Level 10 start, and again between Levels 13/14 and Levels 17/18. Duration ~5 sec each. Blinky walks across with his torn sheet. *(manual)*
- The intermission trigger code references the literals 5, 9, 13, 17 in addition to the existing 2. *(static)*

---

## Tier 4 — Levels 21+ (no regression, run to 255)

All of Tier 3. The Levels 21+ row of the Cruise Elroy and fruit tables is present. The game completes Level 255.

- The fruit table's Levels 21+ row is Key / 5,000 (same as Levels 13-20 — no further scaling). *(static)*
- The Cruise Elroy threshold/speed table has a Levels 21+ row. Thresholds are at their highest (120 dots for Elroy 1, 60 for Elroy 2 in the arcade). *(static — literals 120 and 60 appear)*
- The game runs cleanly through Levels 21 to 255. Pac-Man, ghosts, dots, pellets, fruit, intermissions (none after Level 17), Cruise Elroy, and frightened-skip behavior all continue working without crashes. *(manual)*
- Clearing **Level 255** triggers a final-screen overlay (e.g. "CONGRATULATIONS — Level 255 cleared!"). The game does NOT advance to a Level 256. *(manual)*
- No earlier-tier feature has regressed. Bonus fruit still spawns at 70/170 dots. Cruise Elroy still suspends after Pac-Man's death until Clyde exits. Intermissions still fire at Levels 2, 5, 9, 13, 17 (and nowhere else).

**Cruise Elroy speeds at Levels 21+:** same as Levels 5-20 (Blinky stays fast). Manual playtest at Level 21 confirms Elroy still threatens Pac-Man at the late levels.
