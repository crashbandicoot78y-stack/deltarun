const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let player = {
    x: 200,
    y: 150,
    speed: 1.5,
    runSpeed: 3,
    width: 76,
    height: 152,
    color: "red"
};

let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function update(delta) {
    let speed = keys["x"] ? player.runSpeed : player.speed;

    if(keys["ArrowUp"]) player.y -= speed * delta * 60;
    if(keys["ArrowDown"]) player.y += speed * delta * 60;
    if(keys["ArrowLeft"]) player.x -= speed * delta * 60;
    if(keys["ArrowRight"]) player.x += speed * delta * 60;

    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

function draw() {
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

let lastTime = 0;
function gameLoop(time){
    let delta = (time - lastTime)/1000;
    lastTime = time;

    update(delta);
    draw();
    requestAnimationFrame(gameLoop);
}
gameLoop();
