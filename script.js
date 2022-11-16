const canvas = document.getElementById("snake")
const ctx = canvas.getContext("2d");

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
let snake = [{x: 2, y: 14}];
let fruit = {x: null, y: null}
let direction = "DROITE";

document.addEventListener('keydown',function(evt){
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
    ctx.fillStyle = "greenyellow";
    ctx.strokeStyle = "black";
    for(let i = 0; i < larg; i++){
        for(let j = 0; j < long; j++){
            if((i === 0 || i === 29) || (j === 0 || j === 29)){
                grille[i][j] = "WALL";
                ctx.fillRect(long*j, larg*i, long, larg);
                ctx.strokeRect(long*j, larg*i, long, larg);
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

    console.log(`grille[${fruit.y}][${fruit.x}]`);
}

function drawSnake(postete, couleur){
    ctx.fillStyle = couleur;
    ctx.strokeStyle = "black";
    snake.push(postete);
    //console.log(snake);
    snake.shift();
    //console.log(snake);
    for(const part of snake){
        console.log(part);
        grille[part.y][part.x] = "SNAKE";
        ctx.fillRect(long*part.x, larg*part.y, long, larg)
        ctx.strokeRect(long*part.x, larg*part.y, long, larg)
    }
}

function step(){
    interval = setInterval(function(){
        drawSnake(snake[0], "black");
        if(direction === "DROITE"){
            snake[0].x++;
        }
        else if(direction === "GAUCHE"){
            snake[0].x--;
        }
        else if(direction === "HAUT"){
            snake[0].y--;
        }
        else if(direction === "BAS"){
            snake[0].y++;
        }
        console.log(direction);
        
        drawSnake(snake[0], "yellow");
        collision();
    },1000);
}


function collision(){
    if(snake[0].x == 0 || snake[0].y == 0 || snake[0].x == 30 || snake[0].y == 30 || snake[0] == fruit){
        alert("Vous avez perdu !");
        //clearInterval(interval);
    }
}
setWalls();
setFruit();
drawSnake(snake[0], "yellow");
step();