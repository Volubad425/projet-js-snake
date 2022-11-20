var speed = 100;
var specialOdd = 0;
var playing = false;

var interface = document.getElementById("interface");
var playButton = document.getElementById("playButton");
playButton.addEventListener("click", function () {
    interface.style.display = "block";
    playButton.style.display = "none";
    playing = true;
    start();
    console.log('bonjour');
});








let highscore = 0;
const highscoreText = document.getElementById("highscore");
highscoreText.textContent = "Record : " + highscore;

function start() {
    const canvas = document.getElementById("snake")
    const ctx = canvas.getContext("2d");
    const scoreText = document.getElementById("score");

    scoreText.textContent = "Score : 0";

    const tailleCarr = 20;

    let grille = new Array(canvas.height / tailleCarr);
    for (let i = 0; i < grille.length; i++) {
        grille[i] = new Array(canvas.width / tailleCarr);
        for (j = 0; j < grille[i].length; j++) {
            grille[i][j] = null;
        }
    }

    let interval;
    let score = 0;
    let snake = [{ x: 5, y: 14 }];
    let walls = [];
    let fruit = { x: null, y: null, color: "red" }
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
        ctx.fillStyle = "green";
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
        } while (grille[fruit.y][fruit.x] === "SNAKE" || grille[fruit.y][fruit.x] === "WALL")
        if (Math.floor(Math.random() * specialOdd) === 0) {
            if (Math.floor(Math.random()*2) === 0) {
                fruit.color = "white";
                grille[fruit.y][fruit.x] = "SPEEDUP";
            }
            else {
                fruit.color = "black";
                grille[fruit.y][fruit.x] = "SPEEDDOWN";
            }
        } else {
            fruit.color = "red";
            grille[fruit.y][fruit.x] = "FRUIT";

        }

        ctx.fillStyle = fruit.color;
        ctx.fillRect(tailleCarr * fruit.x, tailleCarr * fruit.y, tailleCarr, tailleCarr);
    }

    function drawSnake() {
        let i = 0;
        ctx.fillStyle = "blue";
        for (const part of snake) {
            if (i % 2 == 0) {
                ctx.fillStyle = "blue";
            }
            else {
                ctx.fillStyle = "yellow";
            }
            if (part.x != null && part.y != null) {
                grille[part.y][part.x] = "SNAKE";
                ctx.fillRect(tailleCarr * part.x, tailleCarr * part.y, tailleCarr, tailleCarr);
            }
            i++;
        }
    }

    function clearSnake() {
        for (const part of snake) {
            if (part.x != null && part.y != null) {
                grille[part.y][part.x] = null;
                ctx.clearRect(tailleCarr * part.x, tailleCarr * part.y, tailleCarr, tailleCarr)
            }
        }
    }

    function update() {
        clearSnake();

        ancienPostete = snake[0];
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

        drawSnake();
    }

    function grow() {
        snake.push({ x: null, y: null });

        score++;
        scoreText.textContent = "Score : " + score;
    }

    function eatFruit() {
        posTete = snake[0]
        if (posTete.x === fruit.x && posTete.y === fruit.y) {
            if (grille[fruit.x][fruit.y] = "SPEEDUP") {
                speed /= 1.5;
            } else if (grille[fruit.x][fruit.y] = "SPEEDDOWN") {
                speed *= 2;
            }
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
                return true;
            }
        }

        for (let i = 1; i < snake.length; i++) {
            if (posTete.x === snake[i].x && posTete.y === snake[i].y) {
                return true;
            }
        }

        return false;
    }

    function step() {
        //if(playing)
        interval = setInterval(function () {
            if (collision()) {
                if (score > highscore) {
                    highscore = score;
                    highscoreText.textContent = "Record : " + score;
                }
                console.log("Vous avez perdu")
                clearInterval(interval);
                playing = false;
                
                // pas besoin -> ctx.clearRect(0, 0, canvas.width, canvas.height)
            }
            else {
                if (eatFruit()) {
                    grow();
                    update();
                    setFruit();
                }
                else {
                    update();
                }
            }
            
        }, speed);
    }
    setWalls();
    setFruit();
    drawSnake();
    step();
}

