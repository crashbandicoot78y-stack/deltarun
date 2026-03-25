const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ===== КАЧЕСТВО =====
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";

// ===== БАЗОВЫЙ РАЗМЕР =====
const baseWidth = 800;
const baseHeight = 600;
let scale = 1;

// ===== ОТКЛЮЧАЕМ СКРОЛЛ =====
window.addEventListener("keydown", function(e) {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) {
        e.preventDefault();
    }
}, { passive: false });

// ===== RESIZE (ГОРИЗОНТАЛЬНЫЙ) =====
function resizeCanvas() {
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    if (screenHeight > screenWidth) {
        [screenWidth, screenHeight] = [screenHeight, screenWidth];
    }

    scale = Math.min(
        screenWidth / baseWidth,
        screenHeight / baseHeight
    );

    canvas.width = baseWidth * scale;
    canvas.height = baseHeight * scale;

    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
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
    speed: 2,
    runSpeed: 3.5,
    frame: 0,
    direction: "down",
    width: 19,
    height: 38,
    scale: 3
};

// ===== СПРАЙТЫ =====
const sprites = {
    down: ["spr_krisd_dark_0.png","spr_krisd_dark_1.png","spr_krisd_dark_2.png","spr_krisd_dark_3.png"],
    up: ["spr_krisu_dark_0.png","spr_krisu_dark_1.png","spr_krisu_dark_2.png","spr_krisu_dark_3.png"],
    left: ["spr_krisl_dark_0.png","spr_krisl_dark_1.png","spr_krisl_dark_2.png","spr_krisl_dark_3.png"],
    right: ["spr_krisr_dark_0.png","spr_krisr_dark_1.png","spr_krisr_dark_2.png","spr_krisr_dark_3.png"]
};

// ===== ЗАГРУЗКА =====
const loadedSprites = {};
for (let dir in sprites) {
    loadedSprites[dir] = [];
    for (let file of sprites[dir]) {
        let img = new Image();
        img.src = "sprites/" + file;
        loadedSprites[dir].push(img);
    }
}

// ===== СТЕНЫ =====
const walls = [
    {x: 300, y: 200, width: 200, height: 50}
];

// ===== УПРАВЛЕНИЕ =====
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

let animationTimer = 0;

// ===== КОЛЛИЗИИ =====
function isColliding(x, y) {
    let w = player.width * player.scale;
    let h = player.height * player.scale;

    for (let wall of walls) {
        if (
            x < wall.x + wall.width &&
            x + w > wall.x &&
            y < wall.y + wall.height &&
            y + h > wall.y
        ) return true;
    }
    return false;
}

// ===== UPDATE =====
function update(delta) {
    let moving = false;

    let currentSpeed = keys["x"] ? player.runSpeed : player.speed;

    let newX = player.x;
    let newY = player.y;

    if(keys["ArrowUp"]) {
        newY -= currentSpeed * delta * 60;
        player.direction = "up";
        moving = true;
    }
    if(keys["ArrowDown"]) {
        newY += currentSpeed * delta * 60;
        player.direction = "down";
        moving = true;
    }
    if(keys["ArrowLeft"]) {
        newX -= currentSpeed * delta * 60;
        player.direction = "left";
        moving = true;
    }
    if(keys["ArrowRight"]) {
        newX += currentSpeed * delta * 60;
        player.direction = "right";
        moving = true;
    }

    if (!isColliding(newX, player.y)) player.x = newX;
    if (!isColliding(player.x, newY)) player.y = newY;

    let w = player.width * player.scale;
    let h = player.height * player.scale;

    player.x = Math.max(0, Math.min(baseWidth - w, player.x));
    player.y = Math.max(0, Math.min(baseHeight - h, player.y));

    if(moving){
        animationTimer += delta;
        if(animationTimer > 0.15){
            player.frame = (player.frame + 1) % 4;
            animationTimer = 0;
        }
    } else {
        player.frame = 0;
    }
}

// ===== DRAW =====
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    ctx.drawImage(room, 0, 0, baseWidth, baseHeight);

    const sprite = loadedSprites[player.direction][player.frame];
    ctx.drawImage(
        sprite,
        player.x,
        player.y,
        player.width * player.scale,
        player.height * player.scale
    );
}

// ===== LOOP =====
let lastTime = 0;
function gameLoop(time){
    let delta = (time - lastTime)/1000;
    lastTime = time;

    update(delta);
    draw();

    requestAnimationFrame(gameLoop);
}
gameLoop();
