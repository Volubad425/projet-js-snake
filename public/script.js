let board;
let food;
let snake;
let speed;

let interval;
let playing = false;

const canvas = document.getElementById("snake");
const ctx = canvas.getContext("2d");
const score = document.getElementById("score");

const interface = document.getElementById("interface");
const playButton = document.getElementById("playButton");
const settings = document.getElementById("settings");
const replayButton = document.getElementById("replayButton");
const MMButton = document.getElementById("MMButton");

(function(){
    async function start(){
        try{
            let response = await fetch("http://localhost/projet-js-snake/public/config.json");
    
            if(response.ok){
                let data = await response.json();
    
                board = data.board;
                food = data.food;
                snake = data.snake;
            }
            else{
                throw ("Erreur : ", response.status);
            }
        }
        catch(err){
            throw err;
        }
    
        const sqSize = canvas.width / board.length;

        function setFood() {
            do {
                food.position.x = Math.floor(Math.random() * (board[0].length - 0) + 0);
                food.position.y = Math.floor(Math.random() * (board.length - 0) + 0);
            } while (board[food.position.y][food.position.x] === "SNAKE");

            if (Math.floor(Math.random() * 10) === 0) {
                if (Math.floor(Math.random() * 2) === 0) {
                    food.color = "white";
                    food.type = "SPEEDUP";
                }
                else {
                    food.color = "black";
                    food.type = "SPEEDDOWN";
                }
            }
            else {
                food.color = "red";
                food.type = null;
            }
    
            board[food.position.y][food.position.x] = "FOOD";
    
            ctx.fillStyle = food.color;
            ctx.fillRect(sqSize * food.position.x, sqSize * food.position.y, sqSize, sqSize);
        }

        function playAudio(sound){
            let audio = new Audio(sound);
            audio.load();
            audio.loop = false;
            audio.play();
        }

        function eatFood() {
            if (snake.body[0].x === food.position.x && snake.body[0].y === food.position.y) {
                snake.speed /= 1.025;
                if (food.type === "SPEEDUP") {
                    snake.speed /= 1.5;
                }
                else if (food.type === "SPEEDDOWN") {
                    snake.speed *= 1.5;
                }
                return true;
            }
            else {
                return false;
            }
        }

        function collision() {
            const head = snake.body[0];

            if((head.x > board.length - 1 || head.y > board.length - 1) || (head.x < 0 || head.y < 0)){
                playAudio('./assets/bump.mp3');
                return true;
            }
            else if(board[head.y][head.x] === "SNAKE"){
                playAudio('./assets/hurt.mp3');
                return true;
            }
            else{
                return false;
            }
        }

        function step(speedParam) {
            interval = setInterval(function () {
                if (speedParam != snake.speed) {
                    clearInterval(interval);
                    console.log(snake.speed);
                    step();
                }

                let tail = snake.body.pop();

                if(tail.x != null && tail.y != null){
                    ctx.clearRect(sqSize * tail.x, sqSize * tail.y, sqSize, sqSize);
                    board[tail.y][tail.x] = "EMPTY";
                }

                let head = snake.body[0];

                switch(snake.direction){
                    case "DROITE":
                        snake.body.unshift({ x: head.x + 1, y: head.y });
                        break;
                    case "GAUCHE":
                        snake.body.unshift({ x: head.x - 1, y: head.y });
                        break;
                    case "BAS":
                        snake.body.unshift({ x: head.x, y: head.y + 1 });
                        break;
                    case "HAUT":
                        snake.body.unshift({ x: head.x, y: head.y - 1 });
                        break;
                }
                head = snake.body[0];

                console.log(head.x + " " + head.y);

                ctx.fillStyle = "white";
                ctx.shadowColor = "rgba(255, 255, 255, 0.3)";
                ctx.shadowBlur = 20;
                ctx.fillRect(sqSize * snake.body[0].x, sqSize * snake.body[0].y, sqSize, sqSize);   

                if (collision()) {
                    console.log("Vous avez perdu");
                    clearInterval(interval);
                    playing = false;
    
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
                else {  
                    if (eatFood()) {
                        playAudio('./assets/eating.mp3');
                        snake.body.push({x: null, y: null});
                        setFood();
                    }
                    board[head.y][head.x] = "SNAKE";
                }
            }, snake.speed);
        }

        document.addEventListener('keyup', function (evt) {
            switch(evt.key){
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

        function init(){
            board[food.position.y][food.position.x] = "FOOD";

            ctx.fillStyle = food.color;
            ctx.shadowColor = food.color;
            ctx.fillRect(sqSize * food.position.x, sqSize * food.position.y, sqSize, sqSize);

            for (const part of snake.body) {
                board[part.y][part.x] = "SNAKE";
                ctx.fillStyle = "white";
                ctx.shadowBlur = 20;
                ctx.shadowColor = "rgba(255, 255, 255, 0.3)";
                
                ctx.fillRect(sqSize * part.x, sqSize * part.y, sqSize, sqSize);
            }
        }

        init();
        step(snake.speed);
    }

    playButton.addEventListener("click", function () {
        interface.id = "interface-var";
        interface.style.display = "flex";
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
})();