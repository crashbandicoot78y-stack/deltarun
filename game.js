const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ===== ЭКРАН (ПРОСТОЙ И СТАБИЛЬНЫЙ) =====
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ===== УБИРАЕМ СКРОЛЛ =====
window.addEventListener("keydown", function(e) {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) {
        e.preventDefault();
    }
}, { passive: false });

// ===== КАРТА =====
const room = new Image();
room.src = "sprites/room.png";

// ===== ИГРОК =====
let player = {
    x: 200,
    y: 150,
    speed: 3,
    runSpeed: 6,
    frame: 0,
    direction: "down",
    width: 19,
    height: 38,
    scale: 3
};

// ===== СПРАЙТЫ =====
const sprites = {
    down: ["spr_krisd_dark_0.png","spr_krisd_dark_1.png","spr_krisd_dark_2.png","spr_krisd_dark_3.png"],
    up: ["spr_krisu_dark_0.png","spr_krisu_dark_1.png","spr_krisu_dark_2.png","spr_krisu_dark_2.png"],
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
        player.y -= speed;
        player.direction = "up";
        moving = true;
    }
    if(keys["ArrowDown"]) {
        player.y += speed;
        player.direction = "down";
        moving = true;
    }
    if(keys["ArrowLeft"]) {
        player.x -= speed;
        player.direction = "left";
        moving = true;
    }
    if(keys["ArrowRight"]) {
        player.x += speed;
        player.direction = "right";
        moving = true;
    }

    // границы
    let w = player.width * player.scale;
    let h = player.height * player.scale;

    player.x = Math.max(0, Math.min(canvas.width - w, player.x));
    player.y = Math.max(0, Math.min(canvas.height - h, player.y));

    // анимация
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

    // карта
    ctx.drawImage(room, 0, 0, canvas.width, canvas.height);

    // игрок
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
