var specialOdd = 10;
var playing = false;
var speed;

var interface = document.getElementById("interface");
var playButton = document.getElementById("playButton");
var settings = document.getElementById("settings");
var replayButton = document.getElementById("replayButton");
var MMButton = document.getElementById("MMButton");

const canvas = document.getElementById("snake");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");

let interval;

playButton.addEventListener("click", function () {
    interface.style.display = "block";
    playButton.style.display = "none";
    settings.style.display = "none";
    playing = true;
    start();
});

replayButton.addEventListener("click", function () {
    playing = true;
    clearInterval(interval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    start();
});

MMButton.addEventListener("click", function () {
    interface.style.display = "none";
    playButton.style.display = "block";
    settings.style.display = "block";
    playing = false;
    clearInterval();
});

let highscore = 0;
const highscoreText = document.getElementById("highscore");
highscoreText.textContent = "Record : " + highscore;

function start() {
    scoreText.textContent = "Score : 0";
    speed = 250;
    const tailleCarr = 20;

    let grille = new Array(canvas.height / tailleCarr);
    for (let i = 0; i < grille.length; i++) {
        grille[i] = new Array(canvas.width / tailleCarr);
        for (let j = 0; j < grille[i].length; j++) {
            grille[i][j] = null;
        }
    }

    let score = 0;
    let snake = [{ x: 5, y: 14 }];
    let walls = [];
    let fruit = { x: null, y: null, color: "red", type: null };
    let direction = "DROITE";

    document.addEventListener('keyup', function (evt) {
        if (evt.key === "ArrowDown") {
            if (direction != "HAUT") {
                direction = "BAS";
            }
        } else if (evt.key === "ArrowLeft") {
            if (direction != "DROITE") {
                direction = "GAUCHE";
            }
        } else if (evt.key === "ArrowRight") {
            if (direction != "GAUCHE") {
                direction = "DROITE";
            }
        } else if (evt.key === "ArrowUp") {
            if (direction != "BAS") {
                direction = "HAUT";
            }
        }
    });

    function setWalls() {
        ctx.fillStyle = "gray";
        for (let i = 0; i < grille.length; i++) {
            for (let j = 0; j < grille[i].length; j++) {
                if ((i === 0 || i === grille.length - 1) || (j === 0 || j === grille[i].length - 1)) {
                    grille[i][j] = "WALL";
                    ctx.fillRect(tailleCarr * j, tailleCarr * i, tailleCarr, tailleCarr);
                    walls.push({ x: j, y: i });
                }
            }
        }
    }

    function setFruit() {
        do {
            fruit.x = Math.floor(Math.random() * (grille[0].length - 0) + 0);
            fruit.y = Math.floor(Math.random() * (grille.length - 0) + 0);
        } while (grille[fruit.y][fruit.x] === "SNAKE" || grille[fruit.y][fruit.x] === "WALL");
        if (Math.floor(Math.random() * specialOdd) === 0) {
            if (Math.floor(Math.random() * 2) === 0) {
                fruit.color = "white";
                fruit.type = "SPEEDUP";
            }
            else {
                fruit.color = "black";
                fruit.type = "SPEEDDOWN";
            }
        }
        else {
            fruit.color = "red";
            fruit.type = null;
        }

        grille[fruit.y][fruit.x] = "FRUIT";

        ctx.fillStyle = fruit.color;
        ctx.fillRect(tailleCarr * fruit.x, tailleCarr * fruit.y, tailleCarr, tailleCarr);
    }

    function drawSnake() {
        let i = 0;
        ctx.fillStyle = "green";
        for (const part of snake) {
            if (part.x != null && part.y != null) {
                grille[part.y][part.x] = "SNAKE";
                ctx.fillRect(tailleCarr * part.x, tailleCarr * part.y, tailleCarr, tailleCarr);
            }
            i++;
        }
    }

    function update(speedParam) {
        if (speedParam != speed) {
            clearInterval(interval);
            console.log(speed);
            step();
        }

        if (snake[snake.length - 1].x != null && snake[snake.length - 1].y != null) {
            ctx.clearRect(tailleCarr * snake[snake.length - 1].x, tailleCarr * snake[snake.length - 1].y, tailleCarr, tailleCarr);
            grille[snake[snake.length - 1].y][snake[snake.length - 1].x] = null;
        }

        let ancienPostete = snake[0];
        snake.pop();
        if (direction === "DROITE") {
            snake.unshift({ x: ancienPostete.x + 1, y: ancienPostete.y });
        }
        else if (direction === "GAUCHE") {
            snake.unshift({ x: ancienPostete.x - 1, y: ancienPostete.y });
        }
        else if (direction == "BAS") {
            snake.unshift({ x: ancienPostete.x, y: ancienPostete.y + 1 });
        }
        else if (direction == "HAUT") {
            snake.unshift({ x: ancienPostete.x, y: ancienPostete.y - 1 });
        }

        grille[snake[0].y][snake[0].x] = "SNAKE";

        ctx.fillStyle = "green";
        ctx.fillRect(tailleCarr * snake[0].x, tailleCarr * snake[0].y, tailleCarr, tailleCarr);
    }

    function grow() {
        snake.push({ x: null, y: null });
    }

    function eatFruit() {
        let posTete = snake[0];
        if (posTete.x === fruit.x && posTete.y === fruit.y) {
            speed /= 1.025;
            if (fruit.type === "SPEEDUP") {
                score += 2;
                speed /= 1.5;
            }
            else if (fruit.type === "SPEEDDOWN") {
                score++;
                speed *= 1.5;
            }
            score++;
            scoreText.textContent = "Score : " + score;

            if (score > highscore) {
                highscore = score;
                highscoreText.textContent = "Record : " + highscore;
            }
            playAudio('./assets/eating.mp3');
            return true;
        }
        else {
            return false;
        }
    }

    function collision() {
        const posTete = snake[0];

        for (const wall of walls) {
            if (posTete.x === wall.x && posTete.y === wall.y) {
                playAudio('./assets/bump.mp3');
                return true;
            }
        }

        for (let i = 1; i < snake.length; i++) {
            if (posTete.x === snake[i].x && posTete.y === snake[i].y) {
                playAudio('./assets/bump.mp3');
                return true;
            }
        }

        return false;
    }

    function step() {
        
        interval = setInterval(function () {
            playAudio('./assets/step.mp3');
            update(speed);
            if (collision()) {
                console.log("Vous avez perdu");
                clearInterval(interval);
                playing = false;

                ctx.clearRect(0, 0, canvas.width, canvas.height)
            }
            else {
                if (eatFruit()) {
                    grow();
                    update();
                    setFruit();
                }
            }

        }, speed);
    }

    function playAudio(sound){
        let audio = new Audio(sound);
        audio.load();
        audio.loop = false;
        audio.play();
    }

    setWalls();
    setFruit();
    drawSnake();
    step();
}