const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const TILE_SIZE = 20;
const ROWS = 20;
const COLS = 20;
/** Horizontal wrap row (classic side tunnel). */
const TUNNEL_ROW = 9;

/** Tile: 1 wall, 0 small dot (+10), 2 empty path, 3 power pellet (+50), 4 ghost jail (ghosts only), 5 door (ghosts only). */
const TILE_WALL = 1;
const TILE_DOT = 0;
const TILE_EMPTY = 2;
const TILE_POWER = 3;
const TILE_GHOST_ONLY = 4;
const TILE_JAIL_ENTRANCE = 5;

/** Ghost jail floor [row, col] — one row of four tiles (classic lineup); row 11 below tunnel. */
const GHOST_JAIL_CELLS = [
    [11, 8], [11, 9], [11, 10], [11, 11]
];

/** Doorway tiles above jail — ghosts only; Pac-Man blocked. */
const GHOST_ENTRANCE_CELLS = [
    [10, 9], [10, 10]
];

/** Row below jail (no dots) — “READY!” sits here. */
const READY_TEXT_ROW = 12;
const READY_TEXT_COL_CENTER = 10;

const GHOST_HOUSE_PAD = 6;

let score = 0;
let gameState = 'playing'; // 'playing' | 'won' | 'lost'
let powerPelletBlink = true;
/** “READY!” until any ghost leaves its start tile. */
let showReady = true;
const PACMAN_START_COL = 7;
const PACMAN_START_ROW = 17;

function tunnelWrap(row, col, dx, dy) {
    let nr = row + dy;
    let nc = col + dx;
    if (row === TUNNEL_ROW && dy === 0) {
        if (nc < 0) nc = COLS - 1;
        else if (nc >= COLS) nc = 0;
    }
    return { nr, nc };
}

function walkableForPacman(nr, nc) {
    if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return false;
    const t = map[nr][nc];
    return t !== TILE_WALL && t !== TILE_GHOST_ONLY && t !== TILE_JAIL_ENTRANCE;
}

function walkableForGhost(nr, nc) {
    if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return false;
    const t = map[nr][nc];
    return t !== TILE_WALL;
}

function hasDotsLeft() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (map[r][c] === TILE_DOT || map[r][c] === TILE_POWER) return true;
        }
    }
    return false;
}

function chebyshevDist(r1, c1, r2, c2) {
    return Math.max(Math.abs(r1 - r2), Math.abs(c1 - c2));
}

/** Anchors for “no dots” buffer (jail floor + doorway). */
const GHOST_NO_DOT_ANCHORS = GHOST_JAIL_CELLS.concat(GHOST_ENTRANCE_CELLS);

function minChebyshevToGhostAnchors(r, c) {
    let m = 99;
    for (let i = 0; i < GHOST_NO_DOT_ANCHORS.length; i++) {
        const [jr, jc] = GHOST_NO_DOT_ANCHORS[i];
        const d = chebyshevDist(r, c, jr, jc);
        if (d < m) m = d;
    }
    return m;
}

/** No pac-dots / pellets next to jail walls (Chebyshev ≤ 2) + band under jail for READY!. */
function isGhostHomeNoDotZone(r, c) {
    if (minChebyshevToGhostAnchors(r, c) <= 2) return true;
    if (r === READY_TEXT_ROW && c >= 6 && c <= 14) return true;
    return false;
}

function stripDotsFromGhostHomeZone() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (!isGhostHomeNoDotZone(r, c)) continue;
            if (map[r][c] === TILE_DOT || map[r][c] === TILE_POWER) {
                map[r][c] = TILE_EMPTY;
            }
        }
    }
}

const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,1],
    [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,0,1,0,1,1,0,0,1,1,0,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1],
    [1,0,0,1,0,1,0,0,0,0,0,0,0,0,1,0,1,0,0,1],
    [1,1,0,1,0,1,1,1,0,1,1,0,1,1,1,0,1,0,1,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,0,0,0,1,1,1,1,1,1,0,0,0,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

for (let i = 0; i < GHOST_JAIL_CELLS.length; i++) {
    const [jr, jc] = GHOST_JAIL_CELLS[i];
    map[jr][jc] = TILE_GHOST_ONLY;
}

/** Four power pellets only (classic corners). */
const POWER_PELLET_CELLS = [
    { row: 1, col: 2 },
    { row: 1, col: 17 },
    { row: 16, col: 1 },
    { row: 16, col: 18 }
];
for (let i = 0; i < POWER_PELLET_CELLS.length; i++) {
    const { row, col } = POWER_PELLET_CELLS[i];
    if (map[row][col] === TILE_DOT) map[row][col] = TILE_POWER;
}

stripDotsFromGhostHomeZone();

for (let i = 0; i < GHOST_ENTRANCE_CELLS.length; i++) {
    const [er, ec] = GHOST_ENTRANCE_CELLS[i];
    map[er][ec] = TILE_JAIL_ENTRANCE;
}

const pacman = {
    x: PACMAN_START_COL,
    y: PACMAN_START_ROW,
    dir: { x: 0, y: 0 },
    nextDir: { x: 0, y: -1 },
    facing: { x: 0, y: -1 },
    radius: 8,
    mouthPhase: 0
};

/** Inky, Pinky, Clyde, Blinky — all start inside jail (left→right); red drawn last. */
const ghosts = [
    { x: 8, y: 11, color: '#00e5ff', dir: { x: 1, y: 0 } },
    { x: 9, y: 11, color: '#ffb6c1', dir: { x: 1, y: 0 } },
    { x: 10, y: 11, color: '#ff9f1c', dir: { x: 1, y: 0 } },
    { x: 11, y: 11, color: '#ff3b30', dir: { x: 1, y: 0 } }
];
ghosts.forEach(g => {
    g.startX = g.x;
    g.startY = g.y;
});

/** Spawn: empty cell between two dots (left/right). */
map[pacman.y][pacman.x] = TILE_EMPTY;

function ghostHouseRectPx() {
    const gx = 8 * TILE_SIZE - GHOST_HOUSE_PAD;
    const gy = 10 * TILE_SIZE - GHOST_HOUSE_PAD * 1.5;
    const gw = 4 * TILE_SIZE + GHOST_HOUSE_PAD * 2;
    const gh = 2 * TILE_SIZE + GHOST_HOUSE_PAD * 2.5;
    return { gx, gy, gw, gh };
}

function drawWallTile(col, row) {
    const x = col * TILE_SIZE;
    const y = row * TILE_SIZE;
    ctx.fillStyle = '#050810';
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    ctx.strokeStyle = '#3db7ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 0.5, y + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
    ctx.strokeStyle = '#9ae5ff';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 3.5, y + 3.5, TILE_SIZE - 7, TILE_SIZE - 7);
}

function strokeRoundRectPath(ctx2, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx2.beginPath();
    if (typeof ctx2.roundRect === 'function') {
        ctx2.roundRect(x, y, w, h, rr);
    } else {
        ctx2.moveTo(x + rr, y);
        ctx2.lineTo(x + w - rr, y);
        ctx2.quadraticCurveTo(x + w, y, x + w, y + rr);
        ctx2.lineTo(x + w, y + h - rr);
        ctx2.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
        ctx2.lineTo(x + rr, y + h);
        ctx2.quadraticCurveTo(x, y + h, x, y + h - rr);
        ctx2.lineTo(x, y + rr);
        ctx2.quadraticCurveTo(x, y, x + rr, y);
        ctx2.closePath();
    }
}

/** Rounded double-line box + door gap (classic ghost house look). */
function drawGhostHouseDecor() {
    const { gx, gy, gw, gh } = ghostHouseRectPx();
    const cornerR = 10;
    const doorW = TILE_SIZE * 2;
    const doorX = gx + (gw - doorW) / 2;

    ctx.save();

    ctx.strokeStyle = '#3d9eff';
    ctx.lineWidth = 3;
    strokeRoundRectPath(ctx, gx, gy, gw, gh, cornerR);
    ctx.stroke();

    ctx.strokeStyle = '#9ae5ff';
    ctx.lineWidth = 1.5;
    strokeRoundRectPath(ctx, gx + 4, gy + 4, gw - 8, gh - 8, Math.max(4, cornerR - 4));
    ctx.stroke();

    ctx.fillStyle = '#000000';
    ctx.fillRect(doorX, gy - 4, doorW, 10);
    ctx.strokeStyle = '#b8ecff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(doorX, gy + 5);
    ctx.lineTo(doorX + doorW, gy + 5);
    ctx.stroke();

    ctx.restore();
}

function drawMap() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const t = map[row][col];
            if (t === TILE_WALL) {
                drawWallTile(col, row);
            } else if (t === TILE_DOT) {
                const cx = col * TILE_SIZE + TILE_SIZE / 2;
                const cy = row * TILE_SIZE + TILE_SIZE / 2;
                ctx.fillStyle = '#ffcc66';
                ctx.fillRect(cx - 1.5, cy - 1.5, 3, 3);
            } else if (t === TILE_POWER) {
                const cx = col * TILE_SIZE + TILE_SIZE / 2;
                const cy = row * TILE_SIZE + TILE_SIZE / 2;
                const pulse = powerPelletBlink ? 1 : 0.45;
                ctx.globalAlpha = pulse;
                ctx.fillStyle = '#ffb347';
                ctx.beginPath();
                ctx.arc(cx, cy, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff2cc';
                ctx.beginPath();
                ctx.arc(cx - 1, cy - 1, 1.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            } else if (t === TILE_GHOST_ONLY) {
                const x = col * TILE_SIZE;
                const y = row * TILE_SIZE;
                ctx.fillStyle = '#0a1020';
                ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
                ctx.strokeStyle = '#1e5080';
                ctx.lineWidth = 1;
                ctx.strokeRect(x + 2.5, y + 2.5, TILE_SIZE - 5, TILE_SIZE - 5);
            } else if (t === TILE_JAIL_ENTRANCE) {
                const x = col * TILE_SIZE;
                const y = row * TILE_SIZE;
                ctx.fillStyle = '#050508';
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                ctx.strokeStyle = '#1a3050';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x + 2, y + TILE_SIZE - 2);
                ctx.lineTo(x + TILE_SIZE - 2, y + TILE_SIZE - 2);
                ctx.stroke();
            }
        }
    }

    drawGhostHouseDecor();

    if (showReady) {
        const readyX = READY_TEXT_COL_CENTER * TILE_SIZE + TILE_SIZE / 2;
        const readyY = READY_TEXT_ROW * TILE_SIZE + TILE_SIZE * 0.62;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.font = 'bold 13px "Courier New", Courier, monospace';
        ctx.letterSpacing = '0.12em';
        ctx.fillStyle = '#ffaa33';
        ctx.fillText('READY!', readyX + 1, readyY + 1);
        ctx.fillStyle = '#ffee88';
        ctx.fillText('READY!', readyX, readyY);
        ctx.restore();
        ctx.textAlign = 'left';
        ctx.letterSpacing = '0px';
    }
}

function drawPacman() {
    const cx = pacman.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = pacman.y * TILE_SIZE + TILE_SIZE / 2;

    const moving = pacman.dir.x !== 0 || pacman.dir.y !== 0;
    const fx = moving ? pacman.dir.x : pacman.facing.x;
    const fy = moving ? pacman.dir.y : pacman.facing.y;
    const faceAngle = Math.atan2(fy, fx);

    let mouthGap = 0.2 * Math.PI;
    if (moving) {
        pacman.mouthPhase += 0.55;
        mouthGap = (0.11 + 0.1 * Math.abs(Math.sin(pacman.mouthPhase))) * Math.PI;
    }

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(faceAngle);
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, pacman.radius, mouthGap, Math.PI * 2 - mouthGap, false);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawGhost(ghost) {
    const cx = ghost.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = ghost.y * TILE_SIZE + TILE_SIZE / 2;
    const r = pacman.radius;

    ctx.fillStyle = ghost.color;
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, 0, false);
    ctx.lineTo(cx + r, cy + r - 1);
    ctx.lineTo(cx + r * 0.35, cy + r - 3);
    ctx.lineTo(cx, cy + r - 1);
    ctx.lineTo(cx - r * 0.35, cy + r - 3);
    ctx.lineTo(cx - r, cy + r - 1);
    ctx.closePath();
    ctx.fill();

    const lookX = ghost.dir.x * 1.5;
    const lookY = ghost.dir.y * 1.5;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx - 4 + lookX, cy - 1 + lookY, 3.2, 0, Math.PI * 2);
    ctx.arc(cx + 4 + lookX, cy - 1 + lookY, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a3a6e';
    ctx.beginPath();
    ctx.arc(cx - 3 + lookX * 1.2, cy + lookY * 1.2, 1.6, 0, Math.PI * 2);
    ctx.arc(cx + 5 + lookX * 1.2, cy + lookY * 1.2, 1.6, 0, Math.PI * 2);
    ctx.fill();
}

function drawGhosts() {
    const red = ghosts.find(g => g.color === '#ff3b30');
    ghosts.forEach(g => {
        if (g !== red) drawGhost(g);
    });
    if (red) drawGhost(red);
}

function movePacman() {
    const tryNext = tunnelWrap(pacman.y, pacman.x, pacman.nextDir.x, pacman.nextDir.y);
    if (walkableForPacman(tryNext.nr, tryNext.nc)) {
        pacman.dir = pacman.nextDir;
    }

    const tryMove = tunnelWrap(pacman.y, pacman.x, pacman.dir.x, pacman.dir.y);
    if (walkableForPacman(tryMove.nr, tryMove.nc)) {
        pacman.x = tryMove.nc;
        pacman.y = tryMove.nr;
    }

    if (pacman.dir.x !== 0 || pacman.dir.y !== 0) {
        pacman.facing = { x: pacman.dir.x, y: pacman.dir.y };
    }

    const cell = map[pacman.y][pacman.x];
    if (cell === TILE_DOT) {
        map[pacman.y][pacman.x] = TILE_EMPTY;
        score += 10;
        scoreElement.innerText = `Score: ${score}`;
    } else if (cell === TILE_POWER) {
        map[pacman.y][pacman.x] = TILE_EMPTY;
        score += 50;
        scoreElement.innerText = `Score: ${score}`;
    }
}

function isOppositeDir(a, b) {
    return a.x === -b.x && a.y === -b.y && (a.x !== 0 || a.y !== 0);
}

function moveGhosts() {
    ghosts.forEach(ghost => {
        const dirs = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
        let possible = dirs.filter(d => {
            const { nr, nc } = tunnelWrap(ghost.y, ghost.x, d.x, d.y);
            return walkableForGhost(nr, nc);
        });

        const rev = ghost.dir;
        if (rev.x !== 0 || rev.y !== 0) {
            const noReverse = possible.filter(d => !isOppositeDir(d, rev));
            if (noReverse.length > 0) possible = noReverse;
        }

        if (possible.length === 0) return;

        const forward = possible.find(d => d.x === rev.x && d.y === rev.y);
        let pick;
        if (forward && Math.random() < 0.85) {
            pick = forward;
        } else {
            pick = possible[Math.floor(Math.random() * possible.length)];
        }

        ghost.dir = pick;
        const { nr, nc } = tunnelWrap(ghost.y, ghost.x, pick.x, pick.y);
        ghost.x = nc;
        ghost.y = nr;
    });
}

/** Death only when Pac-Man and a ghost share the same grid cell (x = col, y = row). */
function pacmanTouchesGhost() {
    const px = Math.floor(pacman.x);
    const py = Math.floor(pacman.y);
    return ghosts.some(g => Math.floor(g.x) === px && Math.floor(g.y) === py);
}

function update() {
    if (gameState !== 'playing') return;

    powerPelletBlink = !powerPelletBlink;

    movePacman();
    if (pacmanTouchesGhost()) {
        gameState = 'lost';
        alert('Game Over!');
        location.reload();
        return;
    }
    if (!hasDotsLeft()) {
        gameState = 'won';
        alert('You win! All pac-dots cleared.');
        location.reload();
        return;
    }

    moveGhosts();
    if (showReady && ghosts.some(g => g.x !== g.startX || g.y !== g.startY)) {
        showReady = false;
    }
    if (pacmanTouchesGhost()) {
        gameState = 'lost';
        alert('Game Over!');
        location.reload();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawPacman();
    drawGhosts();
    setTimeout(update, 200);
}

window.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') pacman.nextDir = { x: 0, y: -1 };
    if (e.key === 'ArrowDown') pacman.nextDir = { x: 0, y: 1 };
    if (e.key === 'ArrowLeft') pacman.nextDir = { x: -1, y: 0 };
    if (e.key === 'ArrowRight') pacman.nextDir = { x: 1, y: 0 };
});

update();
