const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ===== ЭКРАН (РАБОТАЕТ И НА ПК И НА ТЕЛЕФОНЕ) =====
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
    x: 100,
    y: 100,
    speed: 3,
    runSpeed: 6,
    width: 100,   // 🔥 СПЕЦИАЛЬНО БОЛЬШОЙ
    height: 150
};

// ===== УПРАВЛЕНИЕ =====
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// ===== UPDATE =====
function update(delta) {
    let speed = keys["x"] ? player.runSpeed : player.speed;

    if(keys["ArrowUp"]) player.y -= speed;
    if(keys["ArrowDown"]) player.y += speed;
    if(keys["ArrowLeft"]) player.x -= speed;
    if(keys["ArrowRight"]) player.x += speed;

    // границы
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

// ===== DRAW =====
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // ФОН (яркий чтобы видно было)
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // ИГРОК (красный прямоугольник)
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);
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
