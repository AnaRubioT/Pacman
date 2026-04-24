const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const TILE_SIZE = 20;
const ROWS = 20;
const COLS = 20;

let score = 0;

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
    [0,0,0,1,0,1,0,0,0,0,0,0,0,0,1,0,1,0,0,0],
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

const pacman = {
    x: 1,
    y: 1,
    dir: {x: 0, y: 0},
    nextDir: {x: 0, y: 0},
    radius: 8
};

const ghosts = [
    {x: 9, y: 9, color: 'red', dir: {x: 1, y: 0}},
    {x: 10, y: 9, color: 'pink', dir: {x: -1, y: 0}}
];

function drawMap() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (map[row][col] === 1) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else if (map[row][col] === 0) {
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(col * TILE_SIZE + TILE_SIZE/2, row * TILE_SIZE + TILE_SIZE/2, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

function drawPacman() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman.x * TILE_SIZE + TILE_SIZE/2, pacman.y * TILE_SIZE + TILE_SIZE/2, pacman.radius, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacman.x * TILE_SIZE + TILE_SIZE/2, pacman.y * TILE_SIZE + TILE_SIZE/2);
    ctx.fill();
}

function drawGhosts() {
    ghosts.forEach(ghost => {
        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        ctx.arc(ghost.x * TILE_SIZE + TILE_SIZE/2, ghost.y * TILE_SIZE + TILE_SIZE/2, pacman.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function movePacman() {
    let nextX = pacman.x + pacman.nextDir.x;
    let nextY = pacman.y + pacman.nextDir.y;

    if (nextX >= 0 && nextX < COLS && nextY >= 0 && nextY < ROWS && map[nextY][nextX] !== 1) {
        pacman.dir = pacman.nextDir;
    }

    let moveX = pacman.x + pacman.dir.x;
    let moveY = pacman.y + pacman.dir.y;

    if (moveX >= 0 && moveX < COLS && moveY >= 0 && moveY < ROWS && map[moveY][moveX] !== 1) {
        pacman.x = moveX;
        pacman.y = moveY;
    }

    if (map[pacman.y][pacman.x] === 0) {
        map[pacman.y][pacman.x] = 2;
        score += 10;
        scoreElement.innerText = `Score: ${score}`;
    }
}

function moveGhosts() {
    ghosts.forEach(ghost => {
        const dirs = [{x:1, y:0}, {x:-1, y:0}, {x:0, y:1}, {x:0, y:-1}];
        let possibleDirs = dirs.filter(d => {
            let nx = ghost.x + d.x;
            let ny = ghost.y + d.y;
            return nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS && map[ny][nx] !== 1;
        });

        if (possibleDirs.length > 0) {
            let newDir = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
            ghost.x += newDir.x;
            ghost.y += newDir.y;
        }
    });
}

function checkCollision() {
    return ghosts.some(ghost => ghost.x === pacman.x && ghost.y === pacman.y);
}

function update() {
    movePacman();
    moveGhosts();
    if (checkCollision()) {
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
    if (e.key === 'ArrowUp') pacman.nextDir = {x: 0, y: -1};
    if (e.key === 'ArrowDown') pacman.nextDir = {x: 0, y: 1};
    if (e.key === 'ArrowLeft') pacman.nextDir = {x: -1, y: 0};
    if (e.key === 'ArrowRight') pacman.nextDir = {x: 1, y: 0};
});

update();
