const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Карта
const room = new Image();
room.src = "sprites/room.png";

// Игрок
let player = {
    x: 200,
    y: 150,
    speed: 3,
    frame: 0,
    direction: "down"
};

// Спрайты (ТВОИ НАЗВАНИЯ)
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

// Текущая картинка
const playerImg = new Image();
playerImg.src = "sprites/" + sprites.down[0];

let keys = {};
let animationTimer = 0;

// Управление
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Обновление
function update(delta) {
    let moving = false;

    if(keys["ArrowUp"]) {
        player.y -= player.speed;
        player.direction = "up";
        moving = true;
    }
    if(keys["ArrowDown"]) {
        player.y += player.speed;
        player.direction = "down";
        moving = true;
    }
    if(keys["ArrowLeft"]) {
        player.x -= player.speed;
        player.direction = "left";
        moving = true;
    }
    if(keys["ArrowRight"]) {
        player.x += player.speed;
        player.direction = "right";
        moving = true;
    }

    // Ограничение экрана
    player.x = Math.max(0, Math.min(canvas.width - 80, player.x));
    player.y = Math.max(0, Math.min(canvas.height - 80, player.y));

    // Анимация
    if(moving){
        animationTimer += delta;
        if(animationTimer > 0.15){
            player.frame = (player.frame + 1) % 4;
            playerImg.src = "sprites/" + sprites[player.direction][player.frame];
            animationTimer = 0;
        }
    } else {
        player.frame = 0;
        playerImg.src = "sprites/" + sprites[player.direction][0];
    }
}

// Рисование
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Карта
    ctx.drawImage(room, 0, 0, canvas.width, canvas.height);

    // Игрок
    ctx.drawImage(playerImg, player.x, player.y, 80, 80);
}

// Игровой цикл
let lastTime = 0;
function gameLoop(time){
    let delta = (time - lastTime)/1000;
    lastTime = time;

    update(delta);
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();