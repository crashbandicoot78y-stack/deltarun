const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ===== ОТКЛЮЧАЕМ СКРОЛЛ =====
window.addEventListener("keydown", function(e) {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) {
        e.preventDefault();
    }
}, { passive: false });

// ===== FULLSCREEN =====
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
    x: 20,
    y: 15,
    speed: 2,
    runSpeed: 4,
    frame: 0,
    direction: "down",
    width: 19,      // размер спрайта
    height: 38,
    scale: 3        // масштаб для отображения
};

// ===== СПРАЙТЫ =====
const sprites = {
    down: ["spr_krisd_dark_0.png","spr_krisd_dark_1.png","spr_krisd_dark_2.png","spr_krisd_dark_3.png"],
    up: ["spr_krisu_dark_0.png","spr_krisu_dark_1.png","spr_krisu_dark_2.png","spr_krisu_dark_3.png"],
    left: ["spr_krisl_dark_0.png","spr_krisl_dark_1.png","spr_krisl_dark_2.png","spr_krisl_dark_3.png"],
    right: ["spr_krisr_dark_0.png","spr_krisr_dark_1.png","spr_krisr_dark_2.png","spr_krisr_dark_3.png"]
};

// ===== ЗАГРУЗКА СПРАЙТОВ =====
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
        newY -= currentSpeed * 100 * delta;
        player.direction = "up";
        moving = true;
    }
    if(keys["ArrowDown"]) {
        newY += currentSpeed * 100 * delta;
        player.direction = "down";
        moving = true;
    }
    if(keys["ArrowLeft"]) {
        newX -= currentSpeed * 100 * delta;
        player.direction = "left";
        moving = true;
    }
    if(keys["ArrowRight"]) {
        newX += currentSpeed * 100 * delta;
        player.direction = "right";
        moving = true;
    }

    if (!isColliding(newX, player.y)) player.x = newX;
    if (!isColliding(player.x, newY)) player.y = newY;

    // ГРАНИЦЫ ЭКРАНА
    let w = player.width * player.scale;
    let h = player.height * player.scale;
    player.x = Math.max(0, Math.min(canvas.width - w, player.x));
    player.y = Math.max(0, Math.min(canvas.height - h, player.y));

    // АНИМАЦИЯ
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

    // КАРТА НА ВЕСЬ ЭКРАН
    ctx.drawImage(room, 0, 0, canvas.width, canvas.height);

    // СТЕНЫ (для теста)
    ctx.fillStyle = "rgba(255,0,0,0.3)";
    for (let w of walls) {
        ctx.fillRect(w.x, w.y, w.width, w.height);
    }

    // ИГРОК
    const sprite = loadedSprites[player.direction][player.frame];
    ctx.drawImage(
        sprite,
        player.x,
        player.y,
        player.width * player.scale,
        player.height * player.scale
    );
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
