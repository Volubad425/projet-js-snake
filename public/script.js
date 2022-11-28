let board, food, snake, speed;
let score, highscore = 0;

let interval, playing = false;

const canvas = document.getElementById("snake");
const ctx = canvas.getContext("2d");
const scoretxt = document.getElementsByClassName("score");

const menu = document.querySelector(".mainMenu");
const interface = document.querySelector(".interface");
const playButton = document.getElementById("playButton");
const levelsButton = document.getElementById("levelsButton");
const settings = document.getElementById("settings");
const replayButton = document.getElementById("replayButton");
const MMButton = document.getElementById("MMButton");

class Snake {
    constructor(body, speed, direction){
        this.body = body;
        this.direction = direction;
        this.speed = speed;
    }

    draw(){
        for(const part of this.body){
            ctx.fillStyle = "white";
            ctx.shadowBlur = 20;
            ctx.shadowColor = "white";
            ctx.fillRect(20 * part.x, 20 * part.y, 20, 20);
            ctx.shadowBlur = 0;
        }
    }

    step(){
        this.body.pop();

        let oldHead = this.body[0];

        switch(this.direction){
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

    eat(f){
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

    grow(){
        this.body.push({x: null, y: null});
    }

    hit(){
        const head = this.body[0];
        for(let i = 1; i < this.body.length; i++){
            if(this.body[i].x === head.x && this.body[i].y === head.y){
                return true;
            }
        }

        return false;
    }
}

class Food {
    constructor(position, color, type){
        this.position = position;
        this.color = color;
        this.type = type;
    }

    draw(){
        ctx.shadowColor = food.color;
        ctx.shadowBlur = 20;
        ctx.fillStyle = food.color;
        ctx.fillRect(20 * food.position.x, 20 * food.position.y, 20, 20);
        ctx.shadowBlur = 0;
    }

    update(grid, s){
        let status;
        do {
            status = true;

            this.position.x = Math.floor(Math.random() * (grid.width - 0) + 0);
            this.position.y = Math.floor(Math.random() * (grid.height - 0) + 0);

            for(const part of s.body){
                if(part.x === this.position.x && part.y === this.position.y) status = false;
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

class Board {
    constructor(width, height, walls){
        this.width = width;
        this.height = height;
        this.walls = walls;
    }

    setWalls(walls){
        this.walls = walls;
    }

    draw(){
        ctx.strokeStyle = "#454545";
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        for(let i = 0; i < this.width; i++){
            for(let j = 0; j < this.height; j++){
                ctx.strokeRect(j * 20, i * 20, 20, 20);
            }
        }
        ctx.strokeStyle = "#b3ec00";
        for(let i = 0; i < this.walls.length; i++){
            ctx.fillRect(this.walls[i][0] * 20, this.walls[i][1] * 20, 20, 20)
        }
    }
}

(function(){
    async function drawGridMenu(){
        const draw = document.getElementById("draw");
        const drawCtx = draw.getContext("2d");

        let grid;
        let walls = [];

        try{
            let response = await fetch("./config.json");
    
            if(response.ok){
                let data = await response.json();
                grid = data.grid;
            }
            else{
                throw ("Erreur : ", response.status);
            }
        }
        catch(err){
            throw err;
        }

        
        let i = 0;
        let redSq = {x: 0, y: 0, color: "red"};
        let greenSq = {x: grid.width - 1, y: grid.height - 1, color: "green"};

        interval = setInterval(function(){
            if(i < grid.cases.length){
                drawCtx.shadowColor = "white";
                drawCtx.shadowBlur = 20;
                drawCtx.fillStyle = "white";
                drawCtx.fillRect(40 * grid.cases[i].x, 40 * grid.cases[i].y, 40, 40);
                drawCtx.shadowBlur = 0;

                i++;
            }
            else{
                drawCtx.clearRect(0, 0, draw.width, draw.height);

                for(const element of grid.cases){
                    drawCtx.shadowColor = "white";
                    drawCtx.shadowBlur = 20;
                    drawCtx.fillStyle = "white";
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

                if(redSq.x <= 0 && redSq.y < grid.height - 1) redSq.y++;
                else if(redSq.x < grid.width - 1 && redSq.y >= grid.height - 1) redSq.x++;
                else if(redSq.x >= grid.width - 1 && redSq.y > 0) redSq.y--;
                else if(redSq.x > 0 && redSq.y <= 0) redSq.x--;

                if(greenSq.x <= 0 && greenSq.y < grid.height - 1) greenSq.y++;
                else if(greenSq.x < grid.width - 1 && greenSq.y >= grid.height - 1) greenSq.x++;
                else if(greenSq.x >= grid.width - 1 && greenSq.y > 0) greenSq.y--;
                else if(greenSq.x > 0 && greenSq.y <= 0) greenSq.x--;
            }
        }, 100);
    }

    function clearGridMenu(){
        const draw = document.getElementById("draw");
        const drawCtx = draw.getContext("2d");

        drawCtx.clearRect(0, 0, draw.width, draw.height);
    }
    
    async function start(){
        try{
            let response = await fetch("./config.json");
    
            if(response.ok){
                let data = await response.json();
                board = new Board(data.board.width, data.board.height, data.walls);
                food = new Food(data.food.position, data.food.color, data.food.type)
                snake = new Snake(data.snake.body, data.snake.speed, data.snake.direction);
            }
            else{
                throw ("Erreur : ", response.status);
            }
        }
        catch(err){
            throw err;
        }
        try{
            let response = await fetch('./json/level1.json');

            if(response.ok){
                let data = await response.json();

                board.setWalls(data.walls);
            }
            else {
                throw ("Erreur : ", response.status);
            }
        }
        catch(err){
            throw err;
        }

        function playAudio(sound){
            let audio = new Audio(sound);
            audio.load();
            audio.loop = false;
            audio.play();
        }

        function collision() {
            const head = snake.body[0];

            if((head.x > board.width - 1 || head.y > board.height - 1) || (head.x < 0 || head.y < 0)){
                playAudio('./assets/bump.mp3');
                return true;
            }
            else if(snake.hit()){
                playAudio('./assets/hurt.mp3');
                return true;
            }
            else{
                return false;
            }
        }

        function update(speedParam = null){
            interval = setInterval(function(){
                if(snake.speed != speedParam && speedParam != null){
                    clearInterval(interval);
                    update(snake.speed);
                }
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                board.draw();
                if(collision()){
                    console.log("Vous avez perdu");

                    ctx.fillStyle = "#999999";
                    ctx.font = "35px Segoe UI Black";
                    ctx.fillText('YOU LOST', 37, 190);
                    ctx.font = "15px Segoe UI Black";
                    ctx.fillText('PRESS ON REPLAY TO RESTART THE GAME', 80, 220);
                    clearInterval(interval);
                    playing = false;
                }
                else{
                    if(snake.eat(food)){
                        playAudio('./assets/eating.mp3');
                        snake.grow();
                        food.update(board, snake);
                    }

                    snake.step();
                    
                    food.draw();
                    snake.draw();
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

        score = 0;
        scoretxt[0].textContent = score;
        snake.draw();
        food.draw();
        board.draw();
        update(snake.speed);
    }

    drawGridMenu();

    playButton.addEventListener("click", function () {
        interface.class = "interface-var";
        interface.style.display = "block";
        menu.style.display = "none";
        playing = true;
        clearInterval(interval);
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
        menu.style.display = "block";
        playing = false;
        clearInterval(interval);
        clearGridMenu()
        drawGridMenu();
    });
})();