let theme = "dark";

let board, food, snake, speed, walls = [];
let score, highscore = 0, menuInterval, gameInterval, playing = false;

let bgm = new Audio();

const canvas = document.getElementById("snake");
const ctx = canvas.getContext("2d");

const draw = document.getElementById("draw");
const drawCtx = draw.getContext("2d");

const scoretxt = document.getElementsByClassName("score");

const menu = document.querySelector(".mainMenu");
const interface = document.querySelector(".interface");
const settings = document.querySelector(".settings");

const volumeMoins = document.getElementById("volMoins");
const volumeLevP = document.getElementById("volLevel");
const volumePlus = document.getElementById("volPlus");
const playButton = document.getElementById("playButton");
const hardcoreButton = document.getElementById("hardcoreButton");
const levelsButton = document.getElementById("levelsButton");
const settingsButton = document.getElementById("settings");
const replayButton = document.getElementById("replayButton");
const MMButton = document.getElementById("MMButton");


const changeTheme = document.getElementById("theme");
const back = document.getElementById("back");

const buttons = document.getElementsByTagName("button");

// Objet serpent
class Snake {
    // Constructeur
    constructor(body, speed, direction) {
        this.body = body;
        this.direction = direction;
        this.speed = speed;
    }
    draw() {
        if (theme === "dark") {
            ctx.fillStyle = "white";
            ctx.shadowColor = "white";
        }
        else {
            ctx.fillStyle = "black";
            ctx.shadowColor = "black";
        }

        for (const part of this.body) {
            ctx.shadowBlur = 20;
            ctx.fillRect(20 * part.x, 20 * part.y, 20, 20);
            ctx.shadowBlur = 0;
        }
    }
    step() {
        this.body.pop();

        let oldHead = this.body[0];

        switch (this.direction) {
            case "DROITE":
                this.body.unshift({ x: oldHead.x + 1, y: oldHead.y });
                break;
            case "GAUCHE":
                this.body.unshift({ x: oldHead.x - 1, y: oldHead.y });
                break;
            case "BAS":
                this.body.unshift({ x: oldHead.x, y: oldHead.y + 1 });
                break;
            case "HAUT":
                this.body.unshift({ x: oldHead.x, y: oldHead.y - 1 });
                break;
        }
    }
    eat(f) {
        if (this.body[0].x === f.position.x && this.body[0].y === f.position.y) {
            this.speed /= 1.025;
            if (food.type === "SPEEDUP") {
                score += 2;
                this.speed /= 1.5;
            }
            else if (food.type === "SPEEDDOWN") {
                score++;
                this.speed *= 1.5;
            }
            score++;
            scoretxt[0].textContent = score;

            if (score > highscore) {
                highscore = score;
                scoretxt[1].textContent = highscore;
            }

            return true;
        }
        else {
            return false;
        }
    }
    grow() {
        this.body.push({ x: null, y: null });
    }
    hitWall() {
        const head = this.body[0];
        for (const wall of walls) {
            if (wall.x === head.x && wall.y === head.y) return true;
        }
        return false;
    }

    hitBody() {
        const head = this.body[0];
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[i].x === head.x && this.body[i].y === head.y) return true;
        }
        return false;
    }
}

class Food {
    constructor(position, color, type) {
        this.position = position;
        this.color = color;
        this.type = type;
    }

    draw() {
        ctx.shadowColor = food.color;
        ctx.shadowBlur = 20;
        ctx.fillStyle = food.color;
        ctx.fillRect(20 * food.position.x, 20 * food.position.y, 20, 20);
        ctx.shadowBlur = 0;
    }

    update() {
        let status;
        do {
            status = true;

            this.position.x = Math.floor(Math.random() * (board.width - 0) + 0);
            this.position.y = Math.floor(Math.random() * (board.height - 0) + 0);

            for (const part of snake.body) {
                if (part.x === this.position.x && part.y === this.position.y) status = false;
            }

            if (walls.length > 0) {
                for (const wall of walls) {
                    if (wall.x === this.position.x && wall.y === this.position.y) status = false;
                }
            }
        } while (!status);

        if (Math.floor(Math.random() * 10) === 0) {
            if (Math.floor(Math.random() * 2) === 0) {
                this.color = "orange";
                this.type = "SPEEDUP";
            }
            else {
                this.color = "green";
                this.type = "SPEEDDOWN";
            }
        }
        else {
            this.color = "red";
            this.type = null;
        }
    }
}


class Wall {
    constructor(x = null, y = null) {
        this.x = x;
        this.y = y;
    }

    generate() {
        let status;
        do {
            status = true;

            this.x = Math.floor(Math.random() * (board.width - 0) + 0);
            this.y = Math.floor(Math.random() * (board.height - 0) + 0);

            for (const part of snake.body) {
                if (part.x === this.x && part.y === this.y) status = false;
            }
        } while (!status);
    }

    draw() {
        ctx.shadowColor = "purple";
        ctx.shadowBlur = 20;
        ctx.fillStyle = "purple";
        ctx.fillRect(20 * this.x, 20 * this.y, 20, 20);
        ctx.shadowBlur = 0;
    }
}

class Board {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    draw() {
        ctx.strokeStyle = "#454545";
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                ctx.strokeRect(j * 20, i * 20, 20, 20);
            }
        }
    }
}

// Effets audios
function playBGM(sound) {
    bgm = new Audio(sound);
    bgm.load();
    bgm.loop = true;
    bgm.volume = 0.4 * volumeLevP.textContent * 0.1;
    bgm.play();
}

function playAudio(sound) {
    let audio = new Audio(sound);
    audio.volume = volumeLevP.textContent * 0.1;
    audio.load();
    audio.loop = false;
    audio.play();
}

console.log(buttons.length);
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
        playAudio("./assets/bip.mp3");
    });
}

// Menu
async function showMenu() {
    playBGM("./assets/MainMenu-bgm.mp3");
    let grid;

    try {
        let response = await fetch("./json/menu.json");

        if (response.ok) {
            let data = await response.json();
            grid = data.grid;
        }
        else {
            throw ("Erreur : ", response.status);
        }
    }
    catch (err) {
        throw err;
    }


    let i = 0;
    let redSq = { x: 0, y: 0, color: "red" };
    let greenSq = { x: grid.width - 1, y: grid.height - 1, color: "green" };

    menuInterval = setInterval(function () {
        if (i < grid.cases.length) {
            if (theme === "dark") {
                drawCtx.fillStyle = "white";
                drawCtx.shadowColor = "white";
            }
            else {
                drawCtx.fillStyle = "black";
                drawCtx.shadowColor = "black";
            }

            drawCtx.shadowBlur = 20;
            drawCtx.fillRect(40 * grid.cases[i].x, 40 * grid.cases[i].y, 40, 40);
            drawCtx.shadowBlur = 0;

            i++;
        }
        else {
            drawCtx.clearRect(0, 0, draw.width, draw.height);

            if (theme === "dark") {
                drawCtx.fillStyle = "white";
                drawCtx.shadowColor = "white";
            }
            else {
                drawCtx.fillStyle = "black";
                drawCtx.shadowColor = "black";
            }

            for (const element of grid.cases) {
                drawCtx.shadowBlur = 20;
                drawCtx.fillRect(40 * element.x, 40 * element.y, 40, 40);
                drawCtx.shadowBlur = 0;
            }

            drawCtx.shadowColor = redSq.color;
            drawCtx.shadowBlur = 20;
            drawCtx.fillStyle = redSq.color;
            drawCtx.fillRect(40 * redSq.x, 40 * redSq.y, 40, 40);
            drawCtx.shadowBlur = 0;

            drawCtx.shadowColor = greenSq.color;
            drawCtx.shadowBlur = 20;
            drawCtx.fillStyle = greenSq.color;
            drawCtx.fillRect(40 * greenSq.x, 40 * greenSq.y, 40, 40);
            drawCtx.shadowBlur = 0;

            if (redSq.x <= 0 && redSq.y < grid.height - 1) redSq.y++;
            else if (redSq.x < grid.width - 1 && redSq.y >= grid.height - 1) redSq.x++;
            else if (redSq.x >= grid.width - 1 && redSq.y > 0) redSq.y--;
            else if (redSq.x > 0 && redSq.y <= 0) redSq.x--;

            if (greenSq.x <= 0 && greenSq.y < grid.height - 1) greenSq.y++;
            else if (greenSq.x < grid.width - 1 && greenSq.y >= grid.height - 1) greenSq.x++;
            else if (greenSq.x >= grid.width - 1 && greenSq.y > 0) greenSq.y--;
            else if (greenSq.x > 0 && greenSq.y <= 0) greenSq.x--;
        }
    }, 80);
};

function game(jsonLocation) {
    interface.style.display = "block";
    menu.style.display = "none";
    if (gamemode === "normal")
        playBGM("./assets/normal-bgm.mp3");
    else if (gamemode === "hardcore")
        playBGM("./assets/hardcore-bgm.mp3");
    else if (gamemode === "aventure")
        playBGM("./assets/adventure-bgm.mp3");
    playing = true;

    async function start() {

        try {
            let response = await fetch(jsonLocation);

            if (response.ok) {
                let data = await response.json();
                board = new Board(data.board.width, data.board.height, data.walls);
                food = new Food(data.food.position, data.food.color, data.food.type)
                snake = new Snake(data.snake.body, data.snake.speed, data.snake.direction);
            }
            else {
                throw ("Erreur : ", response.status);
            }
        }
        catch (err) {
            throw err;
        }
        console.log("test");

        function collision() {
            const head = snake.body[0];

            if (((head.x > board.width - 1 || head.y > board.height - 1) || (head.x < 0 || head.y < 0))) {
                playAudio('./assets/bump.mp3');
                return true;
            }
            else if (snake.hitBody()) {
                playAudio('./assets/hurt.mp3');
                return true;
            }
            else {
                return false;
            }
        }

        function update(speedParam = null) {
            gameInterval = setInterval(function () {
                if (snake.speed != speedParam && speedParam != null) {
                    clearInterval(gameInterval);
                    update(snake.speed);
                }
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                board.draw();
                if (collision()) {
                    ctx.fillStyle = "#999999";
                    ctx.font = "35px Segoe UI Black";
                    ctx.fillText('YOU LOST', 110, 190);
                    ctx.font = "15px Segoe UI Black";
                    ctx.fillText('Press on REPLAY button to restart', 75, 220);
                    clearInterval(gameInterval);
                    playing = false;
                }
                else {
                    if (snake.eat(food)) {
                        playAudio('./assets/eating.mp3');
                        snake.grow();
                        food.update();
                    }

                    snake.step();
                    food.draw();
                    snake.draw();
                }
            }, snake.speed);
        }

        score = 0;
        scoretxt[0].textContent = score;

        snake.draw();
        food.draw();
        board.draw();

        for (let i = 0; i < walls.length; i++) {
            walls[i].draw();
        }

        update(snake.speed);
    };

    function reset() {
        playing = true;
        clearInterval(gameInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        start();
    }

    MMButton.addEventListener("click", function () {
        replayButton.removeEventListener("click", reset);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        interface.style.display = "none";
        menu.style.display = "flex";
        playing = false;
        bgm.pause();
        playBGM("./assets/MainMenu-bgm.mp3");
        clearInterval(gameInterval);
    });

    replayButton.addEventListener("click", reset);

    start();
}

// Normal mode
playButton.addEventListener("click", function(){
    bgm.pause();
    gamemode = "normal";
    game("./json/normal.json")
});

// Hardcore mode
hardcoreButton.addEventListener("click", function(){
    bgm.pause();
    gamemode = "hardcore";
    game("./json/hardcore.json")
});

settingsButton.addEventListener('click', function () {
    menu.style.display = "none";
    settings.style.display = "block";
});

changeTheme.addEventListener('click', function () {
    if (theme === "dark") {
        document.body.classList.add("light-mode");
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.add("button-light");
        }
        theme = "white";
    }
    else {
        document.body.classList.remove("light-mode");
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove("button-light");
        }
        theme = "dark";
    }
});

back.addEventListener('click', function () {
    menu.style.display = "flex";
    settings.style.display = "none";
});

volumeMoins.addEventListener("click", function () {
    console.log(volumeLevP.textContent);
    if (volumeLevP.textContent > 0)
        volumeLevP.textContent--;
});

volumePlus.addEventListener("click", function () {
    console.log(volumeLevP.textContent);
    if (volumeLevP.textContent < 10)
        volumeLevP.textContent++;
});

playAudio("./assets/MainMenu-bgm.mp3");
showMenu();

document.addEventListener('keyup', function (evt) {
    switch (evt.key) {
        case "ArrowDown":
            if (snake.direction != "HAUT") {
                snake.direction = "BAS";
            }
            break;
        case "ArrowLeft":
            if (snake.direction != "DROITE") {
                snake.direction = "GAUCHE";
            }
            break;
        case "ArrowRight":
            if (snake.direction != "GAUCHE") {
                snake.direction = "DROITE";
            }
            break;
        case "ArrowUp":
            if (snake.direction != "BAS") {
                snake.direction = "HAUT";
            }
            break;
    }
});
