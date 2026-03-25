const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ===== ЭКРАН =====
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ===== ОТКЛЮЧАЕМ СКРОЛЛ =====
window.addEventListener("keydown", function(e) {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) {
        e.preventDefault();
    }
}, { passive: false });

// ===== ИГРОК =====
let player = {
    x: 20,
    y: 15,
    speed: 2,
    runSpeed: 4,
    frame: 0,
    direction: "down",
    width: 39,
    height: 68,
    scale: 5,
    color: "red" // цвет вместо спрайта
};

// ===== УПРАВЛЕНИЕ =====
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

let animationTimer = 0;

// ===== UPDATE =====
function update(delta) {
    let moving = false;

    let speed = keys["x"] ? player.runSpeed : player.speed;

    if(keys["ArrowUp"]) {
        player.y -= speed * delta * 40;
        player.direction = "up";
        moving = true;
    }
    if(keys["ArrowDown"]) {
        player.y += speed * delta * 40;
        player.direction = "down";
        moving = true;
    }
    if(keys["ArrowLeft"]) {
        player.x -= speed * delta * 40;
        player.direction = "left";
        moving = true;
    }
    if(keys["ArrowRight"]) {
        player.x += speed * delta * 40;
        player.direction = "right";
        moving = true;
    }

    // границы
    let w = player.width * player.scale;
    let h = player.height * player.scale;

    player.x = Math.max(0, Math.min(canvas.width - w, player.x));
    player.y = Math.max(0, Math.min(canvas.height - h, player.y));

    // анимация (для будущих спрайтов)
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
    // фон карты
    ctx.fillStyle = "#222"; // тёмно-серый фон
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // игрок
    ctx.fillStyle = player.color;
    ctx.fillRect(
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
