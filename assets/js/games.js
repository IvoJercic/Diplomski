let c;
let ctx;
let tw;
let th;
let resizeRatio = 0.2;
let selectedMap;
let w;
let h;
let currentDirection = "Up";
let currentX;
let currentY;
let gameStarted = false;
let allObstaclesOnMap = [];
let allVisitedFinishesOnMap = [];
let allUnvisitedFinishesOnMap = [];
let readedQuestions = [];

let decodedArrayGlobal = [];
let errorOcured = false;

let pointer = 0;
let currentQuestionId;

let arrayOfInstructions = ["Forward", "Left", "Forward", "Forward", "Right", "Forward", "Forward"];
let visitedAnimals = [];

function goForward(direction) {
    //Dolazak do cilja
    if (allUnvisitedFinishesOnMap.findIndex(element => element.x == currentX && element.y == currentY) != -1) {
        allVisitedFinishesOnMap.push({ x: currentX, y: currentY });
    }

    if (direction == "Up") {
        //Provjeravamo sljedeci tile, ako je prepreka ne idemo tamo
        let nextCord = [{ x: currentX, y: currentY - 1 }];
        //provjeravamo da li se iduci tile gdje igrac zeli otici nalazi na mapi a ako se nalazi da li je to prepreka
        if (allObstaclesOnMap.findIndex(element => element.x == nextCord[0].x && element.y == nextCord[0].y) != -1 || currentY - 1 < 0) {
            //console.log("Prepreka !");
            errorOcured = true;
        }
        else if (allUnvisitedFinishesOnMap.findIndex(element => element.x == nextCord[0].x && element.y == nextCord[0].y) != -1 || currentY - 1 < 0) {
            this.openModal();
            currentY -= 1;
        }
        else {
            currentY -= 1;
        }
    }
    else if (direction == "Right") {
        //Provjeravamo sljedeci tile, ako je prepreka ne idemo tamo
        let nextCord = [{ x: currentX + 1, y: currentY }];
        if (allObstaclesOnMap.findIndex(element => element.x == nextCord[0].x && element.y == nextCord[0].y) != -1 || currentX + 1 > selectedMap.width - 1) {
            //console.log("Prepreka !");
            errorOcured = true;
        }
        else if (allUnvisitedFinishesOnMap.findIndex(element => element.x == nextCord[0].x && element.y == nextCord[0].y) != -1 || currentX + 1 > selectedMap.width - 1) {
            this.openModal();
            currentX += 1;
        }
        else {
            currentX += 1;
        }
    }
    else if (direction == "Down") {
        let nextCord = [{ x: currentX, y: currentY + 1 }];
        if (allObstaclesOnMap.findIndex(element => element.x == nextCord[0].x && element.y == nextCord[0].y) != -1 || currentY + 1 > selectedMap.height - 1) {
            //console.log("Prepreka !");
            errorOcured = true;
        }
        else if (allUnvisitedFinishesOnMap.findIndex(element => element.x == nextCord[0].x && element.y == nextCord[0].y) != -1 || currentX + 1 > selectedMap.width - 1) {
            this.openModal();
            currentY += 1;
        }
        else {
            currentY += 1;
        }
    }
    else if (direction == "Left") {
        let nextCord = [{ x: currentX - 1, y: currentY }];
        if (allObstaclesOnMap.findIndex(element => element.x == nextCord[0].x && element.y == nextCord[0].y) != -1 || currentX - 1 < 0) {
            //console.log("Prepreka !");
            errorOcured = true;
        }
        else if (allUnvisitedFinishesOnMap.findIndex(element => element.x == nextCord[0].x && element.y == nextCord[0].y) != -1 || currentX - 1 < 0) {
            this.openModal();
            currentX -= 1;
        }
        else {
            currentX -= 1;
        }
    }
    allUnvisitedFinishesOnMap.forEach(element => {
        //console.log(element);
    });

    allVisitedFinishesOnMap.forEach(element => {
        //console.log(element);
    });
}

function executeInstructions() {
    this.lockElement("selectAnswer", 1500 * arrayOfInstructions.length);
    this.lockElement("selectMap", 1500 * arrayOfInstructions.length);
    //this.lockElement("btnStartExecution", 1500 * arrayOfInstructions.length);        
    //this.lockElement("btnNextStep", 1500 * arrayOfInstructions.length);
    document.getElementById("btnNextStep").disabled = true;
    document.getElementById("btnStartExecution").disabled = true;

    if (arrayOfInstructions != null) {
        for (let index = 0; index < arrayOfInstructions.length; index++) {
            setTimeout(() => {
                //Ukoliko smo negdje doslo do prepreke ova varijabla se postavlja na false i tada se prekida izvrsavanje instrukcija
                if (errorOcured == false) {
                    const element = arrayOfInstructions[index];
                    if (element == "Forward") {
                        this.goForward(currentDirection);
                    }
                    else if (element == "Right") {
                        if (currentDirection == "Up") currentDirection = "Right"
                        else if (currentDirection == "Right") currentDirection = "Down"
                        else if (currentDirection == "Down") currentDirection = "Left"
                        else if (currentDirection == "Left") currentDirection = "Up"
                    }
                    else if (element == "Left") {
                        if (currentDirection == "Up") currentDirection = "Left"
                        else if (currentDirection == "Right") currentDirection = "Up"
                        else if (currentDirection == "Down") currentDirection = "Right"
                        else if (currentDirection == "Left") currentDirection = "Down"
                    }
                    if (errorOcured == false) {
                        this.drawGame();
                        document.getElementById("divStepByStep").innerHTML += index + 1 + ". - " + element + " ( " + decodedArrayGlobal[index + 1] + " ) " + "<br>";
                    }
                    else {
                        document.getElementById("divStepByStep").innerHTML += "<p style='color:red'>PREPREKA !</p>";
                        gameStarted = false;
                    }
                }
            }, 1500 * index);
        }
    }
}

function changeMap(n) {
    this.lockElement("selectMap", 2000);
    this.lockElement("selectAnswer", 2000);
    this.lockElement("btnStartExecution", 2000);
    this.lockElement("btnNextStep", 2000);

    gameStarted = false;
    allVisitedFinishesOnMap = [];
    pointer = 0;
    errorOcured = false;
    currentDirection = "Up"
    visitedAnimals = [];
    document.getElementById("divVisitedAnimals").innerHTML = "<h4>Posjecene zivotinje</h4>";

    switch (parseInt(n)) {
        case 1:
            selectedMap = mapa1;
            break;
        case 2:
            selectedMap = mapa2;
            break;
        case 3:
            selectedMap = mapa3;
            break;
        case 4:
            selectedMap = mapa4;
            break;
        case 5:
            selectedMap = mapa5;
            break;
        case 6:
            selectedMap = mapa6;
            break;
        case 7:
            selectedMap = mapa7;
            break;
        case 8:
            selectedMap = mapa8;
            break;
        default:
        // code block
    }
    w = selectedMap.width;
    h = selectedMap.height;

    //tile width and tile height
    tw = selectedMap.tilewidth;
    th = selectedMap.tileheight;

    c.width = w * tw * resizeRatio;
    c.height = h * th * resizeRatio;

    document.getElementById("divStepByStep").innerHTML = "";
    this.drawGame();
    this.showGrid(resizeRatio);
}

function showGrid(resizeRatio) {
    setTimeout(() => {
        var g = new Image();

        if (selectedMap.name == "map1" || selectedMap.name == "map2" || selectedMap.name == "map3" || selectedMap.name == "map4") {
            g.src = "img/cucgrid1.png";
        }
        else if (selectedMap.name == "map5") {
            g.src = "img/grid1.png";
        }
        else if (selectedMap.name == "map6" || selectedMap.name == "map7" || selectedMap.name == "map8") {
            g.src = "img/grid2.png";
        }

        g.width = c.width;
        g.height = c.height;
        g.onload = function () {
            ctx.drawImage(g, 0, 0, g.width, g.height);
        }
    }, 750);//750 ili 25 lokalno
}

function drawElements(arrayOfCordinates, imageSrc) {
    arrayOfCordinates.forEach(element => {
        //console.log(element.x);
        let g = new Image();
        setTimeout(() => {
            g.src = imageSrc;
            g.width = c.width / selectedMap.width;
            g.height = c.height / selectedMap.height;
            //console.log("W_H: " + g.width + " " + g.height);
            g.onload = function () {
                ctx.drawImage(g, element.x * g.width, element.y * g.height, g.height, g.height);
            }
        }, 1250);//1250 ili 50 lokalno
    });
}

function lockElement(id, time) {
    document.getElementById(id).disabled = true;

    setTimeout(() => {
        document.getElementById(id).disabled = false;
    }, time);
}

function initCordinates(playerCordinatesJSON) {
    currentX = playerCordinatesJSON[0].x;
    currentY = playerCordinatesJSON[0].y;
}

function setPlayer() {
    if (gameStarted == false) {
        let player;
        gameStarted = true;

        if (selectedMap.name == "map1") {
            player = [{ x: 6, y: 4 }];
            this.drawElements(player, "img/robotUp.png");
        }
        else if (selectedMap.name == "map2") {
            player = [{ x: 6, y: 4 }];
            this.drawElements(player, "img/robotUp.png");
        }
        else if (selectedMap.name == "map3") {
            player = [{ x: 6, y: 4 }];
            this.drawElements(player, "img/robotUp.png");
        }
        else if (selectedMap.name == "map4") {
            player = [{ x: 5, y: 3 }];
            this.drawElements(player, "img/robotUp.png");
        }
        else if (selectedMap.name == "map5") {
            player = [{ x: 5, y: 4 }];
            this.drawElements(player, "img/robotUp.png");
        }
        else if (selectedMap.name == "map6") {
            player = [{ x: 1, y: 1 }];
            this.drawElements(player, "img/robotUp.png");
        }
        else if (selectedMap.name == "map7") {
            player = [{ x: 6, y: 7 }];
            this.drawElements(player, "img/santaUp.png");
        }
        else if (selectedMap.name == "map8") {
            player = [{ x: 3, y: 5 }];
            this.drawElements(player, "img/robotUp.png");
        }
        this.initCordinates(player);

    }
    else {
        let tempCord = [{ x: currentX, y: currentY }]
        this.drawElements(tempCord, "img/robot" + currentDirection + ".png");
    }
}

function drawGame() {
    var image = new Image()
    image.src = selectedMap.image;
    image.width = c.width;
    image.height = c.height;
    image.onload = function () {
        ctx.drawImage(image, 0, 0, image.width, image.height);
    }

    if (selectedMap.name == "map1") {
        //Koordinate svih kucica koje dodajemo na mapu
        const cages = [{ x: 1, y: 0 }, { x: 6, y: 0 }, { x: 2, y: 4 }];
        const kuca1 = [{ x: 6, y: 1 }];
        const kuca2 = [{ x: 3, y: 1 }];
        const kuca3 = [{ x: 4, y: 2 }];
        const kuca4 = [{ x: 5, y: 4 }];
        const kuca5 = [{ x: 2, y: 3 }];
        const kuca6 = [{ x: 1, y: 1 }];
        const otherObstacles = [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 1, y: 3 }, { x: 1, y: 4 }]

        this.drawElements(cages, "img/kavez.png");
        this.drawElements(kuca1, "img/kuca1.png");
        this.drawElements(kuca2, "img/kuca2.png");
        this.drawElements(kuca3, "img/kuca3.png");
        this.drawElements(kuca4, "img/kuca4.png");
        this.drawElements(kuca5, "img/kuca5.png");
        this.drawElements(kuca6, "img/kuca6.png");
        this.drawElements(allVisitedFinishesOnMap, "img/kavez2.png")


        allObstaclesOnMap = [...new Set([...kuca1, ...kuca2, ...kuca3, ...kuca4, ...kuca5, ...kuca6, ...otherObstacles])]
        allUnvisitedFinishesOnMap = [...new Set([...cages])]
    }
    else if (selectedMap.name == "map2") {
        const cages = [{ x: 3, y: 1 }, { x: 0, y: 4 }];
        const kuca1 = [{ x: 6, y: 2 }];
        const kuca2 = [{ x: 3, y: 3 }];
        const kuca3 = [{ x: 4, y: 3 }];
        const kuca4 = [{ x: 3, y: 2 }];
        const kuca5 = [{ x: 1, y: 4 }];
        const kuca6 = [{ x: 5, y: 1 }];
        const otherObstacles = [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }]

        this.drawElements(cages, "img/kavez.png");
        this.drawElements(kuca1, "img/kuca1.png");
        this.drawElements(kuca2, "img/kuca2.png");
        this.drawElements(kuca3, "img/kuca3.png");
        this.drawElements(kuca4, "img/kuca4.png");
        this.drawElements(kuca5, "img/kuca5.png");
        this.drawElements(kuca6, "img/kuca6.png");
        this.drawElements(allVisitedFinishesOnMap, "img/kavez2.png")

        allObstaclesOnMap = [...new Set([...kuca1, ...kuca2, ...kuca3, ...kuca4, ...kuca5, ...kuca6, ...otherObstacles])]
        allUnvisitedFinishesOnMap = [...new Set([...cages])]
    }
    else if (selectedMap.name == "map3") {
        const cages = [{ x: 4, y: 0 }, { x: 5, y: 2 }, { x: 2, y: 3 }];
        const kuca1 = [{ x: 4, y: 1 }];
        const kuca2 = [{ x: 1, y: 1 }];
        const kuca3 = [{ x: 6, y: 0 }];
        const kuca4 = [{ x: 3, y: 1 }];
        const kuca5 = [{ x: 1, y: 4 }];
        const kuca6 = [{ x: 1, y: 2 }];
        const otherObstacles = [{ x: 3, y: 3 }, { x: 4, y: 3 }, { x: 3, y: 4 }, { x: 4, y: 4 }];

        this.drawElements(cages, "img/kavez.png");
        this.drawElements(kuca1, "img/kuca1.png");
        this.drawElements(kuca2, "img/kuca2.png");
        this.drawElements(kuca3, "img/kuca3.png");
        this.drawElements(kuca4, "img/kuca4.png");
        this.drawElements(kuca5, "img/kuca5.png");
        this.drawElements(kuca6, "img/kuca6.png");
        this.drawElements(allVisitedFinishesOnMap, "img/kavez2.png")

        allObstaclesOnMap = [...new Set([...kuca1, ...kuca2, ...kuca3, ...kuca4, ...kuca5, ...kuca6, ...otherObstacles])]
        allUnvisitedFinishesOnMap = [...new Set([...cages])]
    }
    else if (selectedMap.name == "map4") {
        const cages = [{ x: 1, y: 1 }, { x: 3, y: 2 }, { x: 5, y: 2 }];
        const otherObstacles = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 6, y: 1 }, { x: 6, y: 2 }, { x: 6, y: 3 }, { x: 2, y: 2 }, { x: 4, y: 2 }]

        this.drawElements(cages, "img/kavez.png");
        this.drawElements(allVisitedFinishesOnMap, "img/kavez2.png")

        allObstaclesOnMap = [...new Set([...otherObstacles])]
        allUnvisitedFinishesOnMap = [...new Set([...cages])]
    }
    else if (selectedMap.name == "map5") {
        const cages = [{ x: 3, y: 2 }, { x: 2, y: 3 }, { x: 5, y: 3 }];
        const otherObstacles = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 6, y: 1 }, { x: 6, y: 2 }, { x: 6, y: 3 }, { x: 6, y: 4 }, { x: 6, y: 5 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 5, y: 1 }, { x: 4, y: 3 }, { x: 2, y: 4 }]

        this.drawElements(cages, "img/kavez.png");
        this.drawElements(allVisitedFinishesOnMap, "img/kavez2.png")
        allObstaclesOnMap = [...new Set([...otherObstacles])]
        allUnvisitedFinishesOnMap = [...new Set([...cages])]

    }
    else if (selectedMap.name == "map6") {
        const cages = [{ x: 6, y: 1 }, { x: 3, y: 4 }, { x: 5, y: 3 }];
        const otherObstacles = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 }, { x: 0, y: 9 }, { x: 1, y: 9 }, { x: 2, y: 9 }, { x: 3, y: 9 }, { x: 4, y: 9 }, { x: 5, y: 9 }, { x: 6, y: 9 }, { x: 7, y: 9 }, { x: 8, y: 9 }, { x: 9, y: 9 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 0, y: 7 }, { x: 0, y: 8 }, { x: 9, y: 1 }, { x: 9, y: 2 }, { x: 9, y: 3 }, { x: 9, y: 4 }, { x: 9, y: 5 }, { x: 9, y: 6 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 7, y: 2 }, { x: 6, y: 4 }, { x: 5, y: 5 }, { x: 3, y: 6 }, { x: 1, y: 5 }, { x: 1, y: 6 }, { x: 2, y: 5 }, { x: 2, y: 6 }]

        this.drawElements(cages, "img/kavez.png");
        this.drawElements(allVisitedFinishesOnMap, "img/kavez2.png")
        allObstaclesOnMap = [...new Set([...otherObstacles])]
        allUnvisitedFinishesOnMap = [...new Set([...cages])]

    }
    else if (selectedMap.name == "map7") {
        const otherObstacles = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 }, { x: 0, y: 9 }, { x: 1, y: 9 }, { x: 2, y: 9 }, { x: 3, y: 9 }, { x: 4, y: 9 }, { x: 5, y: 9 }, { x: 6, y: 9 }, { x: 7, y: 9 }, { x: 8, y: 9 }, { x: 9, y: 9 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 0, y: 7 }, { x: 0, y: 8 }, { x: 9, y: 1 }, { x: 9, y: 2 }, { x: 9, y: 3 }, { x: 9, y: 4 }, { x: 9, y: 5 }, { x: 9, y: 6 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 2, y: 4 }, { x: 5, y: 2 }, { x: 4, y: 8 }]

        allObstaclesOnMap = [...new Set([...otherObstacles])];
    }
    else if (selectedMap.name == "map8") {
        const cages = [{ x: 6, y: 1 }, { x: 3, y: 4 }, { x: 5, y: 3 }];
        const otherObstacles = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 }, { x: 0, y: 9 }, { x: 1, y: 9 }, { x: 2, y: 9 }, { x: 3, y: 9 }, { x: 4, y: 9 }, { x: 5, y: 9 }, { x: 6, y: 9 }, { x: 7, y: 9 }, { x: 8, y: 9 }, { x: 9, y: 9 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 0, y: 7 }, { x: 0, y: 8 }, { x: 9, y: 1 }, { x: 9, y: 2 }, { x: 9, y: 3 }, { x: 9, y: 4 }, { x: 9, y: 5 }, { x: 9, y: 6 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 7, y: 2 }, { x: 6, y: 4 }, { x: 5, y: 5 }, { x: 3, y: 6 }, { x: 1, y: 5 }, { x: 1, y: 6 }, { x: 2, y: 5 }, { x: 2, y: 6 }]
        this.drawElements(cages, "img/kavez.png");
        this.drawElements(allVisitedFinishesOnMap, "img/kavez2.png")
        allObstaclesOnMap = [...new Set([...otherObstacles])]
        allUnvisitedFinishesOnMap = [...new Set([...cages])]
    }
    this.showGrid(resizeRatio);

    this.setPlayer();
}

function decodeAnswer(answer) {
    let temp = answer.split(" ");
    decodedArrayGlobal = temp;
    if (temp[0] == "341") {
        if (temp[temp.length - 1] == "369") {
            let decodedArray = [];
            //Ako rjesenje zadovoljava uvjete prvog i zadnjeg koda krecemo u dekodiranje
            temp.forEach(element => {
                if (element == "109") {
                    decodedArray.push("Left");
                }
                else if (element == "103") {
                    decodedArray.push("Right");
                }
                else if (element == "333") {
                    decodedArray.push("Forward");
                }
            });
            //console.log("DEKODIRANO: " + decodedArray);
            return decodedArray;
        }
        else {
            alert("Ovo rjesenje ne zavrsava s naredbom END !");
            return null;
        }
    }
    else {
        alert("Ovo rjesenje ne pocinje s naredbom START !");
        return null;
    }
}

function changeAnswer(answer) {
    arrayOfInstructions = this.decodeAnswer(answer);
    if (arrayOfInstructions != null) {
        //console.log("ANSWER CHANGED " + answer);
        gameStarted = false;
        errorOcured = false;
        document.getElementById("divStepByStep").innerHTML = "";
        allVisitedFinishesOnMap = [];
        visitedAnimals = [];
        document.getElementById("divVisitedAnimals").innerHTML = "<h4>Posjecene zivotinje</h4>";
        pointer = 0;
        currentDirection = "Up"
        document.getElementById("btnStartExecution").disabled = false;
        document.getElementById("btnNextStep").disabled = false;

        this.drawGame();
    }
}

function executeInstructionsStepByStep() {
    if (errorOcured == false && pointer < arrayOfInstructions.length) {
        this.lockElement("btnNextStep", 1500);

        document.getElementById("btnStartExecution").disabled = true;

        const element = arrayOfInstructions[pointer];
        if (element == "Forward") {
            this.goForward(currentDirection);
        }
        else if (element == "Right") {
            if (currentDirection == "Up") currentDirection = "Right"
            else if (currentDirection == "Right") currentDirection = "Down"
            else if (currentDirection == "Down") currentDirection = "Left"
            else if (currentDirection == "Left") currentDirection = "Up"
        }
        else if (element == "Left") {
            if (currentDirection == "Up") currentDirection = "Left"
            else if (currentDirection == "Right") currentDirection = "Up"
            else if (currentDirection == "Down") currentDirection = "Right"
            else if (currentDirection == "Left") currentDirection = "Down"
        }
        if (errorOcured == false) {
            this.drawGame();
            document.getElementById("divStepByStep").innerHTML += pointer + 1 + ". - " + element + " ( " + decodedArrayGlobal[pointer + 1] + " ) " + "<br>";
        }
        else {
            document.getElementById("divStepByStep").innerHTML += "<p style='color:red'>PREPREKA !</p>";
            gameStarted = false;
        }
        pointer++;
    }
}

function submitAnswer(id) {
    if (questions[currentQuestionId].odgovori[id].tocan == true) {
        this.closeModal();
        visitedAnimals.push(questions[currentQuestionId].odgovori[id].ime);
        document.getElementById("divVisitedAnimals").innerHTML += questions[currentQuestionId].odgovori[id].ime + "<br>";

        window.open("/ar/" + questions[currentQuestionId].name);
    }
    else {
        alert("Netocno!");
    }
}

function showHint() {
    document.getElementById("hintParagraph").innerHTML = '<p style="color:red"> POMOĆ: ' + questions[currentQuestionId].hint + '</p>';
}

function executeManualInstruction(instruction) {
    if (instruction == "Forward") {
        this.goForward(currentDirection);
    }
    else if (instruction == "Right") {
        if (currentDirection == "Up") currentDirection = "Right"
        else if (currentDirection == "Right") currentDirection = "Down"
        else if (currentDirection == "Down") currentDirection = "Left"
        else if (currentDirection == "Left") currentDirection = "Up"
    }
    else if (instruction == "Left") {
        if (currentDirection == "Up") currentDirection = "Left"
        else if (currentDirection == "Right") currentDirection = "Up"
        else if (currentDirection == "Down") currentDirection = "Right"
        else if (currentDirection == "Left") currentDirection = "Down"
    }
    this.drawGame();
    document.getElementById("divStepByStep").innerHTML += "***  - " + instruction + " " + "<br>";
}

window.onload = function () {
    c = document.getElementById("canvasGame");
    ctx = c.getContext("2d");
    this.changeMap(1);
    document.getElementById("divStepByStep").style.height = document.getElementById("canvasGame").style.height;
    gameStarted = true;
    arrayOfInstructions = [];

}