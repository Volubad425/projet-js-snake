// Variables relatives au jeu
let theme, storage;

// Variables relatives au jeu lorsqu'il est lancé
let board, food, snake, walls, goal, remaining;
let score, highscore = 0, menuInterval, gameInterval, playing = false, gamemode;

// Musique de fond
const bgm = document.getElementById("bgm");

// Canvas de l'interface de jeu
const canvas = document.getElementById("snake");
const ctx = canvas.getContext("2d");

// Canvas de l'animation du menu
const draw = document.getElementById("draw");
const drawCtx = draw.getContext("2d");

// Liste des objets HTML du jeu 
const menu = document.querySelector(".mainMenu"); // Menu
const interface = document.querySelector(".interface"); // Jeu
const settings = document.querySelector(".settings"); // Paramètres
const guide = document.querySelector(".guide"); // Guide (Comment jouer)
const levels = document.querySelector(".levels"); // Liste des niveaux
const credits = document.querySelector(".credits"); // Crédits

// Liste des textes de score (3)
const scoretxt = document.getElementsByClassName("score"); // Valeur score
const scoreTexte = document.querySelector(".scoreTexte"); // "Score"
const highscoreTexte = document.querySelector(".highscoreTexte"); // "Highscore"
const goalTexte = document.querySelector(".goalTexte"); // "Remaining"

// Volume musique de fond
const volumeLevP = document.getElementById("volLevel");

// Liste des bouttons
const volumeMoins = document.getElementById("volMoins"); // Baisse le volume
const volumePlus = document.getElementById("volPlus"); // Monte le volume
const playButton = document.getElementById("playButton"); // Lance le mode normal
const hardcoreButton = document.getElementById("hardcoreButton"); // Lance le mode hardcore
const levelsButton = document.getElementById("levelsButton"); // Affiche la liste des niveaux
const guideButton = document.getElementById("guideButton"); // Affiche la page comment jouer
const settingsButton = document.getElementById("settingsButton"); // Affiche les paramètres
const creditsButton = document.getElementById("credits"); // Affiche les crédits
const replayButton = document.getElementById("replayButton"); // Relance le jeu
const MMButton = document.getElementById("MMButton"); // Revient au menu
const changeThemeButton = document.getElementById("theme"); // Change le theme
const resetButton = document.getElementById("reset"); // Réintialise le jeu
const level1Button = document.getElementById("level1"); // Lance le niveau 1
const level2Button = document.getElementById("level2"); // Lance le niveau 2
const level3Button = document.getElementById("level3"); // Lance le niveau 3
const level4Button = document.getElementById("level4"); // Lance le niveau 3
const buttons = document.getElementsByTagName("button"); // Liste entiere des bouttons
const backButtons = document.getElementsByClassName("backButton"); // Liste des bouttons pour revenir au menu

// Autres
const themeIcon = document.querySelector(".fa-moon"); // Icone theme ("lune" et "soleil")
const sbodyImg = document.getElementById("sbody"); // Image corps du snake du menu "Comment jouer", change de couleur en fonction du theme

// Chargement des paramètres de theme à partir du stockage local
storage = localStorage.getItem("NASnaketheme");
if (storage) {
    theme = storage;
    if (theme === "light") {
        document.body.classList.add("light-mode");
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.add("button-light");
        }
        sbodyImg.src = "././assets/snake-body2.png";
        themeIcon.classList.value = "fa fa-sun";
        changeThemeButton.textContent = "";
        changeThemeButton.appendChild(themeIcon);
        changeThemeButton.appendChild(document.createTextNode(" Light Mode"));
    }
}
else {
    theme = "dark";
}

// Chargement des paramètres de volume à partir du stockage local
storage = localStorage.getItem("NASnakevolume");
if (storage) {
    volumeLevP.textContent = storage;
}
else {
    volumeLevP.textContent = "10";
}

// Classe relative au serpent
class Snake {
    // Constructeur
    constructor(body, speed, direction) {
        this.body = body;
        this.direction = direction;
        this.speed = speed;
    }

    // Dessin sur le canvas
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

    // Mouvement
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

    // Test si il mange le fruit
    eat(f) {
        if (this.body[0].x === f.position.x && this.body[0].y === f.position.y) {
            this.speed /= 1.05;
            if (food.type === "SPEEDUP") {
                score += 2;
                if(gamemode === "levels") remaining -= 2;
                this.speed /= 1.5;
            }
            else if (food.type === "SPEEDDOWN") {
                score++;
                if(gamemode === "levels") remaining--;
                this.speed *= 1.4;
            }
            score++;
            scoretxt[0].textContent = score;

            if (score > highscore && gamemode != "levels") {
                highscore = score;
                scoretxt[1].textContent = highscore;
            }
            else if(gamemode === "levels"){
                remaining--;

                if(remaining < 0) scoretxt[2].textContent = 0;
                else scoretxt[2].textContent = remaining;
            }

            return true;
        }
        else {
            return false;
        }
    }

    // Grandissement
    grow() {
        this.body.push({ x: null, y: null });
    }

    // Test si il touche un mur
    hitWall() {
        const head = this.body[0];
        for (const wall of walls) {
            if (wall.x === head.x && wall.y === head.y) return true;
        }
        return false;
    }

    // Test si il touche son corps
    hitBody() {
        const head = this.body[0];
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[i].x === head.x && this.body[i].y === head.y) return true;
        }
        return false;
    }
}

// Classe relative au fruit
class Food {
    // Constructeur
    constructor(position, color, type) {
        this.position = position;
        this.color = color;
        this.type = type;
    }

    // Dessin sur le canvas
    draw() {
        ctx.shadowColor = food.color;
        ctx.shadowBlur = 20;
        ctx.fillStyle = food.color;
        ctx.fillRect(20 * food.position.x, 20 * food.position.y, 20, 20);
        ctx.shadowBlur = 0;
    }

    // Change de position sur la grille
    update() {
        let status;
        do {
            status = true;

            this.position.x = Math.floor(Math.random() * (board.width - 0) + 0);
            this.position.y = Math.floor(Math.random() * (board.height - 0) + 0);

            for (const part of snake.body) {
                if (part.x === this.position.x && part.y === this.position.y) status = false;
            }

            if(gamemode != "normal"){
                if (walls.length > 0) {
                    for (const wall of walls) {
                        if (wall.x === this.position.x && wall.y === this.position.y) status = false;
                    }
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

// Classe relative au mur=
class Wall {
    // Constructeur
    constructor(x = null, y = null) {
        this.x = x;
        this.y = y;
    }

    // Generation d'un mur sur la grille
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

    // Dessin sur le canvas
    draw() {
        ctx.shadowColor = "#3803AD";
        ctx.shadowBlur = 20;
        ctx.fillStyle = "#3803AD";
        ctx.fillRect(20 * this.x, 20 * this.y, 20, 20);
        ctx.shadowBlur = 0;
    }
}

// Classe relative à la grille
class Board {
    // Constructeur
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    // Dessin sur la canvas
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

// Musique de fond
function playBGM(sound) {
    bgm.pause();
    bgm.src = sound;
    bgm.load();
    bgm.loop = true;
    bgm.volume = volumeLevP.textContent * 0.1;
    bgm.play();
}

// Effets audios
function playAudio(sound) {
    let audio = new Audio(sound);
    audio.volume = volumeLevP.textContent * 0.1;
    audio.load();
    audio.loop = false;
    audio.play();
}

// Menu
async function showMenu() {
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
    drawCtx.clearRect(0, 0, draw.width, draw.height);
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


// Fonction relative au lancement du jeu
function game(jsonLocation) {
    interface.style.display = "block";
    menu.style.display = "none";
    if (gamemode === "normal")
        playBGM("./assets/normal-bgm.mp3");
    else if (gamemode === "hardcore")
        playBGM("./assets/hardcore-bgm.mp3");
    playing = true;

    // Lancement
    async function start() {

        try {
            let response = await fetch(jsonLocation);

            if (response.ok) {
                let data = await response.json();
                board = new Board(data.board.width, data.board.height, data.walls);
                food = new Food(data.food.position, data.food.color, data.food.type)
                snake = new Snake(data.snake.body, data.snake.speed, data.snake.direction);
                
                if (gamemode != "normal") {
                    walls = [];
                    for (const wall of data.walls) {
                        walls.push(new Wall(wall.x, wall.y));
                    }

                    if(gamemode === "levels"){
                        goal = data.goal;
                    }
                }
            }
            else {
                throw ("Erreur : ", response.status);
            }
        }
        catch (err) {
            throw err;
        }

        // Test de collision
        function collision() {
            const head = snake.body[0];

            if (((head.x > board.width - 1 || head.y > board.height - 1) || (head.x < 0 || head.y < 0))) {
                playAudio('./assets/bump.mp3');
                return true;
            }
            if (gamemode != "normal" && snake.hitWall()) {
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

        // Mise a jour de la grille
        function update(speedParam = null) {
            gameInterval = setInterval(function () {
                if (snake.speed != speedParam && speedParam != null) {
                    clearInterval(gameInterval);
                    update(snake.speed);
                }
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                
                if (collision()) {
                    if (gamemode == "normal") {
                        localStorage.setItem("NASnakeHSnormal", highscore);
                    }
                    else if (gamemode == "hardcore") {
                        localStorage.setItem("NASnakeHShardcore", highscore);
                    }

                    ctx.fillStyle = theme == "dark" ? "#999999" : "black";
                    ctx.font = "35px Segoe UI Black";
                    ctx.fillText('YOU LOST', 110, 190);
                    ctx.font = "10px Segoe UI Black";
                    ctx.fillText('Press on REPLAY button to restart the game or try another challenge', 30, 220);
                    clearInterval(gameInterval);
                    playing = false;
                }
                else if (gamemode === "levels" && score >= goal) {
                    playAudio('./assets/shoot.mp3');
                    ctx.fillStyle = theme == "dark" ? "#999999" : "black";
                    ctx.font = "35px Segoe UI Black";
                    ctx.fillText('YOU WON', 110, 190);
                    ctx.font = "10px Segoe UI Black";
                    ctx.fillText('Press on REPLAY button to restart the game or try another challenge', 30, 220);
                    clearInterval(gameInterval);
                    playing = false;
                }
                else {
                    if (snake.eat(food)) {
                        playAudio('./assets/eating.mp3');
                        snake.grow();
                        if (gamemode === "hardcore") {
                            walls.push(new Wall(null, null));
                            for (let i = 0; i < walls.length; i++) {
                                walls[i].generate();
                            }
                        }
                        food.update();
                    }

                    if (gamemode === "hardcore" || gamemode === "levels") {
                        for (let i = 0; i < walls.length; i++) {
                            walls[i].draw();
                        }
                    }

                    board.draw();
                    snake.step();
                    food.draw();
                    snake.draw();
                }
            }, snake.speed);
        }

        score = 0;
        scoretxt[0].textContent = score;

        // Chargement des records
        if (gamemode == "normal") {
            storage = localStorage.getItem("NASnakeHSnormal");
        }
        else if (gamemode == "hardcore") {
            storage = localStorage.getItem("NASnakeHShardcore");
        }

        // Ecriture des records
        if (storage) {
            highscore = Number(storage);
        }
        else {
            highscore = 0;
        }

        // Ecriture du "Remaining" sur les niveaux
        if(gamemode === "levels"){
            remaining = goal;
            scoretxt[2].textContent = goal;
        } 

        scoretxt[1].textContent = highscore;

        snake.draw();
        food.draw();
        board.draw();

        update(snake.speed);
    };

    // Reinitialise la grille et relance
    function reset() {
        playing = true;
        clearInterval(gameInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        start();
    }

    // Event listener sur le boutton du retour au menu
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

    // Event listener sur le boutton rejouer
    replayButton.addEventListener("click", reset);

    // Lancement du jeu
    start();
}

// Event listener sur le boutton jouer pour lancer le mode normal
playButton.addEventListener("click", function () {
    bgm.pause();
    gamemode = "normal";
    highscoreTexte.style.display = "flex";
    goalTexte.style.display = "none";
    game("./json/normal.json");
});

// Event listener sur le boutton hardcore pour lancer le mode hardcore
hardcoreButton.addEventListener("click", function () {
    bgm.pause();
    gamemode = "hardcore";
    highscoreTexte.style.display = "flex";
    goalTexte.style.display = "none";
    game("./json/hardcore.json")
});

// Event listener sur le boutton level 1 pour lancer le niveau 1
level1Button.addEventListener("click", function () {
    levels.style.display = "none";
    game("./json/Levels/level1.json");
});

// Event listener sur le boutton level 2 pour lancer le niveau 2
level2Button.addEventListener("click", function () {
    levels.style.display = "none";
    game("./json/Levels/level2.json");
});

// Event listener sur le boutton level 3 pour lancer le niveau 3
level3Button.addEventListener("click", function () {
    levels.style.display = "none";
    game("./json/Levels/level3.json");
});

// Event listener sur le boutton level 3 pour lancer le niveau 3
level4Button.addEventListener("click", function () {
    levels.style.display = "none";
    game("./json/Levels/level4.json");
});

// Event listener sur le boutton level 3 pour afficher les niveaux
levelsButton.addEventListener('click', function () {
    menu.style.display = "none";
    levels.style.display = "flex";
    highscoreTexte.style.display = "none";
    goalTexte.style.display = "flex";
    gamemode = "levels";
    playBGM("./assets/level-bgm.mp3");
});

// Event listener sur le boutton level 3 pour afficher les paramètres
settingsButton.addEventListener('click', function () {
    menu.style.display = "none";
    settings.style.display = "flex";
    playBGM("./assets/settings-bgm.mp3");
});

// Event listener sur le boutton level 3 pour afficher le guide
guideButton.addEventListener('click', function () {
    menu.style.display = "none";
    guide.style.display = "flex";
    playBGM("./assets/guide-bgm.mp3");
});

// Event listener sur le boutton de changement de theme pour changer le thème du jeu ("Dark Mode" et "Light Mode")
changeThemeButton.addEventListener('click', function () {
    if (theme === "dark") {
        document.body.classList.add("light-mode");
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.add("button-light");
        }
        theme = "light";
        sbodyImg.src = "././assets/snake-body2.png";
        themeIcon.classList.value = "fa fa-sun";
        changeThemeButton.textContent = "";
        changeThemeButton.appendChild(themeIcon);
        changeThemeButton.appendChild(document.createTextNode(" Light Mode"));
    }
    else {
        document.body.classList.remove("light-mode");
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove("button-light");
        }
        theme = "dark";
        themeIcon.classList.value = "fa fa-moon";
        sbodyImg.src = "././assets/snake-body.png";
        changeThemeButton.textContent = "";
        changeThemeButton.appendChild(themeIcon);
        changeThemeButton.appendChild(document.createTextNode(" Dark Mode"));
    }

    clearInterval(menuInterval);
    showMenu();
    localStorage.setItem("NASnaketheme", theme);
});

// Event listener sur le boutton reset de theme pour réinitialiser le jeu
resetButton.addEventListener('click', function () {
    if (confirm("Are you sure to reset all the settings ?")) {
        localStorage.clear();
        window.location.reload();
    };
});

// Event listener sur le boutton volume - pour baisser le volume
volumeMoins.addEventListener("click", function () {
    console.log(volumeLevP.textContent);
    if (volumeLevP.textContent > 0)
        volumeLevP.textContent--;
    localStorage.setItem("NASnakevolume", volumeLevP.textContent);
    bgm.volume = volumeLevP.textContent * 0.1;
});

// Event listener sur le boutton volume + pour monter le volume
volumePlus.addEventListener("click", function () {
    console.log(volumeLevP.textContent);
    if (volumeLevP.textContent < 10)
        volumeLevP.textContent++;
    localStorage.setItem("NASnakevolume", volumeLevP.textContent);
    bgm.volume = volumeLevP.textContent * 0.1;
});

// Event listener sur le boutton crédits pour afficher les crédits
creditsButton.addEventListener("click", function(){
    credits.style.display = "flex";
    menu.style.display = "none";
    playBGM("./assets/credits-bgm.mp3");
})

// Event listener sur le boutton de retour des menus paramètres, niveaux, guide et crédits
backButtons[0].addEventListener('click', function () {
    playBGM("./assets/MainMenu-bgm.mp3");
    menu.style.display = "flex";
    levels.style.display = "none";
});

backButtons[1].addEventListener('click', function () {
    playBGM("./assets/MainMenu-bgm.mp3");
    menu.style.display = "flex";
    guide.style.display = "none";
});

backButtons[2].addEventListener('click', function () {
    playBGM("./assets/MainMenu-bgm.mp3");
    menu.style.display = "flex";
    settings.style.display = "none";
});

backButtons[3].addEventListener('click', function () {
    playBGM("./assets/MainMenu-bgm.mp3");
    menu.style.display = "flex";
    credits.style.display = "none";
});

// Event listener sur les boutton pour ajouter un effet sonore
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
        playAudio("./assets/bip.mp3");
    });
}

// Events listener sur les touches haut, bas, gauche, droite permettant de changer la position du serpent
document.addEventListener('keyup', function (evt) {
    evt.preventDefault();
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

/* 
    Auteurs :
        - DE SAINT JEAN Nicolas
        - RANDRIAMANANTENA Aro

*/


// Fin du code (ligne 800)