const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ===== КАРТА =====
const room = new Image();
room.src = "sprites/room.png";

// ===== ИГРОК =====
let player = {
    x: 200,
    y: 150,
    speed: 1.8,
    frame: 0,
    direction: "down"
};

// ===== СПРАЙТЫ =====
const sprites = {
    down: [
        "spr_krisd_dark_0.png",
        "spr_krisd_dark_1.png",
        "spr_krisd_dark_2.png",
        "spr_krisd_dark_3.png"
    ],
    up: [
        "spr_krisu_dark_0.png",
        "spr_krisu_dark_1.png",
        "spr_krisu_dark_2.png",
        "spr_krisu_dark_3.png"
    ],
    left: [
        "spr_krisl_dark_0.png",
        "spr_krisl_dark_1.png",
        "spr_krisl_dark_2.png",
        "spr_krisl_dark_3.png"
    ],
    right: [
        "spr_krisr_dark_0.png",
        "spr_krisr_dark_1.png",
        "spr_krisr_dark_2.png",
        "spr_krisr_dark_3.png"
    ]
};

// ===== ПРЕДЗАГРУЗКА СПРАЙТОВ =====
const loadedSprites = {};

for (let dir in sprites) {
    loadedSprites[dir] = [];
    for (let i = 0; i < sprites[dir].length; i++) {
        let img = new Image();
        img.src = "sprites/" + sprites[dir][i];
        loadedSprites[dir].push(img);
    }
}

// ===== КАМЕРА =====
const camera = {
    x: 0,
    y: 0
};

// ===== СТЕНЫ =====
const walls = [
    {x: 300, y: 200, width: 200, height: 50},
    {x: 600, y: 400, width: 50, height: 200}
];

// ===== УПРАВЛЕНИЕ =====
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// ===== ПРОВЕРКА СТОЛКНОВЕНИЙ =====
function isColliding(x, y) {
    for (let wall of walls) {
        if (
            x < wall.x + wall.width &&
            x + 80 > wall.x &&
            y < wall.y + wall.height &&
            y + 80 > wall.y
        ) {
            return true;
        }
    }
    return false;
}

let animationTimer = 0;

// ===== UPDATE =====
function update(delta) {
    let moving = false;

    let newX = player.x;
    let newY = player.y;

    if(keys["ArrowUp"]) {
        newY -= player.speed * 100 * delta;
        player.direction = "up";
        moving = true;
    }
    if(keys["ArrowDown"]) {
        newY += player.speed * 100 * delta;
        player.direction = "down";
        moving = true;
    }
    if(keys["ArrowLeft"]) {
        newX -= player.speed * 100 * delta;
        player.direction = "left";
        moving = true;
    }
    if(keys["ArrowRight"]) {
        newX += player.speed * 100 * delta;
        player.direction = "right";
        moving = true;
    }

    // Коллизии
    if (!isColliding(newX, player.y)) {
        player.x = newX;
    }
    if (!isColliding(player.x, newY)) {
        player.y = newY;
    }

    // Анимация
    if(moving){
        animationTimer += delta;
        if(animationTimer > 0.15){
            player.frame = (player.frame + 1) % 4;
            animationTimer = 0;
        }
    } else {
        player.frame = 0;
    }

    // Камера
    camera.x = player.x - canvas.width / 2 + 40;
    camera.y = player.y - canvas.height / 2 + 40;
}

// ===== DRAW =====
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // Карта
    ctx.drawImage(room, 0, 0);

    // Стены (для отладки)
    ctx.fillStyle = "rgba(255,0,0,0.3)";
    for (let wall of walls) {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    }

    // Игрок
    const currentSprite = loadedSprites[player.direction][player.frame];
    ctx.drawImage(currentSprite, player.x, player.y, 80, 80);

    ctx.restore();
}

// ===== GAME LOOP =====
let lastTime = 0;
function gameLoop(time){
    let delta = (time - lastTime)/1000;
    lastTime = time;

    update(delta);
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();
