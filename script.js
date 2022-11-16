const canvas = document.getElementById("snake")
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");

const long = 30;
const larg = 30;

let grille = [
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]
]

let interval;
let score = 0;
let snake = [{x: 5, y: 14}];
let walls = [];
let fruit = {x: null, y: null}
let direction = "DROITE";

document.addEventListener('keyup',function(evt){
    if(evt.key === "ArrowDown"){
        if(direction != "HAUT"){
            direction = "BAS";
        }
    }else if(evt.key === "ArrowLeft"){
        if(direction != "DROITE"){
            direction = "GAUCHE";
        }
    }else if(evt.key === "ArrowRight"){
        if(direction != "GAUCHE"){
            direction = "DROITE";
        }
    }else if(evt.key === "ArrowUp"){
        if(direction != "BAS"){
            direction = "HAUT";
        }
    }
});

function setWalls(){
    ctx.fillStyle = "green";
    for(let i = 0; i < larg; i++){
        for(let j = 0; j < long; j++){
            if((i === 0 || i === long - 1) || (j === 0 || j === larg - 1)){
                grille[i][j] = "WALL";
                ctx.fillRect(long*j, larg*i, long, larg);
                walls.push({x: j, y: i});
            }
        }
    }
}

function setFruit(){
    do{
        fruit.x = Math.floor(Math.random() * (long - 0) + 0);
        fruit.y = Math.floor(Math.random() * (larg - 0) + 0);
    }while(grille[fruit.y][fruit.x] === "SNAKE" || grille[fruit.y][fruit.x] === "WALL")

    grille[fruit.y][fruit.x] = "FRUIT";

    ctx.fillStyle = "red";
    ctx.fillRect(long*fruit.x, larg*fruit.y, long, larg);
}

function drawSnake(){
    ctx.fillStyle = "blue";
    for(const part of snake){
        if(part.x != null && part.y != null){
            grille[part.y][part.x] = "SNAKE";
            ctx.fillRect(long*part.x, larg*part.y, long, larg);
        }
    }
}

function clearSnake(){
    for(const part of snake){
        if(part.x != null && part.y != null){
            grille[part.y][part.x] = null;
            ctx.clearRect(long*part.x, larg*part.y, long, larg)
        }
    }
}

function update(){
    clearSnake();
    
    ancienPostete = snake[0];
    snake.pop();
    if(direction === "DROITE"){
        snake.unshift({x: ancienPostete.x + 1, y: ancienPostete.y});
    }
    else if(direction === "GAUCHE"){
        snake.unshift({x: ancienPostete.x - 1, y: ancienPostete.y});
    }
    else if(direction == "BAS"){
        snake.unshift({x: ancienPostete.x, y: ancienPostete.y + 1});
    }
    else if(direction == "HAUT"){
        snake.unshift({x: ancienPostete.x, y: ancienPostete.y - 1});
    }

    drawSnake();
}

function grow(){
    snake.push({x: null, y: null});

    score++;
    scoreText.textContent = "Score : " + score;
}

function eatFruit(){
    posTete = snake[0]
    if(posTete.x === fruit.x && posTete.y === fruit.y){
        return true;
    }
    else{
        return false;
    }
}

function collision(){
    const posTete = snake[0];

    for(const wall of walls){
        if(posTete.x === wall.x && posTete.y === wall.y){
            return true;
        }
    }

    for(let i = 1; i < snake.length; i++){
        if(posTete.x === snake[i].x && posTete.y === snake[i].y){
            return true;
        }
    }

    return false;
}

function step(){
    interval = setInterval(function(){
        if(collision()){
            alert("Vous avez perdu")
            clearInterval(interval);
        }
        else{
            if(eatFruit()){
                grow();
                update();
                setFruit();
            }
            else{
                update();
            }
        }
    }, 100);
}

setWalls();
setFruit();
drawSnake();
step();