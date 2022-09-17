class Game {
    constructor (){
        this.hadgehog = null; //will store an instance of the class Player
        this.apples = []; //will store instances of the class Obstacle
    }
    start() {
        this.hadgehog = new Hadgehog (10, 10, 50, 0, "hadgehog");
        this.attachEventListeners();
        
        let appleWidth = 5;
        let appleHeigth = appleWidth;
        const applesAppear = setInterval(() => {
            
            //let randomApple = Math.floor(Math.random()*(101 - appleWidth));
            const appleInstance = new Apple(5, appleWidth, Math.floor(Math.random()*(101 - appleWidth)), 100, "apple");
            this.apples.push(appleInstance);
        }, 2000);
        const applesDrop = setInterval(() => {
            this.apples.forEach((apple) => {
                apple.movingDown();
                if (apple.positionY < 0) {
                    //clearInterval(applesDrop);
                    apple.domElement.remove();
                    this.apples.shift();
                    //console.log(appleInstance.domElement);
                }
            })
            
        }, 60); 
    }
    attachEventListeners(){
        document.addEventListener("keydown", (event) => {

            if(event.key === "ArrowLeft"){
                this.hadgehog.movingLeft();
            }else if(event.key === "ArrowRight"){
                this.hadgehog.movingRight();
            }
            if(event.key === "ArrowDown"){
                this.hadgehog.movingDown();
            }else if(event.key === "ArrowUp"){
                this.hadgehog.movingUp();
            }
        });
    }
}

class MovingParts {
    constructor (height, width, positionX, positionY, idByClass){
        this.height = height;
        this.width = width;
        this.positionX = positionX;
        this.positionY = positionY;
        this.domElement = null;
        this.idByClass = idByClass;

        this.createDomElement();
    }

    createDomElement(){
        // create dom element
        this.domElement = document.createElement('div');
        // set id and css
        // windowWidth * vw / 100
        if (window.innerWidth >= window.innerHeight) {
            this.domElement.style.width = window.innerHeight * this.height / 100 + "px";
            console.log(window.innerWidth + ' --- ' + window.innerHeight);

        } else {
            this.domElement.style.height = window.innerWidth * this.width / 100 + "vh";
        }



        this.domElement.className = this.idByClass;
        //this.domElement.style.width = this.width + "vw";
        //this.domElement.style.height = this.height + "vh";
        this.domElement.style.bottom = this.positionY + "vh";
        this.domElement.style.left = this.positionX + "vw";
        //this.domElement.style.backgroundImage = "url('/oop-game-codealong/images/player-left.png')"
        // append to the dom
        const boardElm = document.getElementById("board");
        boardElm.appendChild(this.domElement)
    }

    movingLeft() {
        this.positionX--;
        this.domElement.style.left = this.positionX + "vw";
    }

    movingRight() {
        this.positionX++;
        this.domElement.style.left = this.positionX + "vw";
    }

    movingDown() {
        this.positionY--;
        this.domElement.style.bottom = this.positionY + "vh";
    }

    movingUp() {
        this.positionY++;
        this.domElement.style.bottom = this.positionY + "vh";
    }
}

class Hadgehog extends MovingParts {
    constructor (height, width, positionX, positionY, idByClass){
        super(height, width, positionX, positionY, idByClass);
      
    }
}

class Apple extends MovingParts {
    constructor (height, width, positionX, positionY, idByClass){
        super(height, width, positionX, positionY, idByClass);
       
    }
}

const game = new Game();
game.start();