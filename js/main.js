class Game {
    constructor (){
        this.hadgehog = null; //will store an instance of the class Player
        this.apples = []; //will store instances of the class Obstacle
    }
    start() {
        this.hadgehog = new Hadgehog (10, 10, 50, 0, "hadgehog", "board");
        this.attachEventListeners();
        
        let appleWidth = 5;
        let appleHeigth = appleWidth;
        const applesAppear = setInterval(() => {
            
            let randomAppleX = Math.floor(Math.random()*(101 - appleWidth));
            let randomAppleY = Math.floor(Math.random()*(61 - appleHeigth) + 40);
            const appleInstance = new Apple(5, appleWidth, randomAppleX, randomAppleY, "apple", "container");
            this.apples.push(appleInstance);
            if (this.apples.length >10) {
                clearInterval(applesAppear);
            }
            
        }, 1000);
        
        
    }

    shakeTree () {
        const applesDrop = setInterval(() => {
            this.apples.forEach((apple) => {
                //apple.movingDown();
                
                if (apple.positionY > apple.stopPosition) {
                    //clearInterval(applesDrop);
                    //apple.domElement.remove();
                    //this.apples.shift();
                    //console.log(this.apples);
                    apple.movingDown();
                    
                }
                this.detectCollision(apple);
                //console.log(apple);
            })
            //console.log(this.apples);
        }, 60);
    }

    attachEventListeners () {
        
        document.addEventListener("keydown", (event) => {
            
                //let tree = document.getElementById("container"); 
                //let treeMiddle = (tree.getBoundingClientRect().right - tree.getBoundingClientRect().left)/2 + tree.getBoundingClientRect().left;
            if (event.key === "ArrowLeft") {
                this.hadgehog.movingLeft();
                if (this.detectCollision(this.hadgehog, event.key)) {
                    
                    this.shakeTree();
                }
            } else if (event.key === "ArrowRight"){
                this.hadgehog.movingRight();
                
                if (this.detectCollision(this.hadgehog, event.key)) {
                    
                    this.shakeTree();
                }

            }
            if(event.key === "ArrowDown"){
                this.hadgehog.movingDown();
            }else if(event.key === "ArrowUp"){
                this.hadgehog.movingUp();
            }
            
        });
    }

    detectCollision(playerInstance, ev) {
        if (ev) {
            let tree = document.getElementById("container"); 
            let treeMiddle = ((tree.getBoundingClientRect().right - tree.getBoundingClientRect().left)/2 + 
            tree.getBoundingClientRect().left)*100/window.innerWidth;
            if ((ev === "ArrowLeft" && playerInstance.positionX -2 < treeMiddle || ev === "ArrowRight" && 
            playerInstance.positionX + 4 > treeMiddle) && playerInstance.positionY > 3) {
                //console.log(treeMiddle + ' --- ' + playerInstance.positionX);
                return true;
            } else {
                return false;
            }
        } else { 
            if (this.hadgehog.positionX < playerInstance.positionX + playerInstance.width &&
                this.hadgehog.positionX + this.hadgehog.width > playerInstance.positionX &&
                this.hadgehog.positionY < playerInstance.positionY + playerInstance.height &&
                this.hadgehog.height + this.hadgehog.positionY > playerInstance.positionY) {
                    //console.log(this.hadgehog.positionX+'..<..'+playerInstance.positionX+'..+..'+playerInstance.width+'..&..'+
                    //    this.hadgehog.positionX+'..+..'+this.hadgehog.width+'..>..'+playerInstance.positionX+'..&..'+
                    //    this.hadgehog.positionY+'..<..'+playerInstance.positionY+'..+..'+playerInstance.height+'..&..'+
                    //    this.hadgehog.height+'..+..'+this.hadgehog.positionY+'..>..'+playerInstance.positionY);
                    this.hadgehog.pickUp(playerInstance);
                    console.log(playerInstance);
            }
        }           
    }


}

class MovingParts {
    constructor (height, width, positionX, positionY, idByClass, idParentContainer){
        this.height = height;
        this.width = width;
        this.positionX = positionX;
        this.positionY = positionY;
        this.domElement = null;
        this.idByClass = idByClass;
        this.idParentContainer = idParentContainer;
        this.createDomElement();
    }

    createDomElement(){
        // create dom element
        this.domElement = document.createElement('div');
        // set id and css
        
        if (window.innerWidth >= window.innerHeight) {
            this.domElement.style.width = window.innerHeight * this.height / 100 + "px";
            this.domElement.style.height = this.height + "vh";
        } else {
            this.domElement.style.width = this.width + "vw";
            this.domElement.style.height = window.innerWidth * this.width / 100 + "px";
        }
        this.domElement.className = this.idByClass;
        this.domElement.style.bottom = this.positionY + "vh";
        this.domElement.style.left = this.positionX + "%";
        //this.domElement.style.backgroundImage = "url('/oop-game-codealong/images/player-left.png')"
        // append to the dom
        const boardElm = document.getElementById(this.idParentContainer);
        boardElm.appendChild(this.domElement)
    }

    movingLeft() {
        this.positionX--;
        this.domElement.style.left = this.positionX + "%";
    }

    movingRight() {
        this.positionX++;
        this.domElement.style.left = this.positionX + "%";
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
    constructor (height, width, positionX, positionY, idByClass, idParentContainer){
        super(height, width, positionX, positionY, idByClass, idParentContainer);
      
    }
    pickUp (pickedUpApple) {
        pickedUpApple.positionX = this.positionX;
        pickedUpApple.positionY = this.positionY;
    }
}

class Apple extends MovingParts {
    constructor (height, width, positionX, positionY, idByClass, idParentContainer){
        super(height, width, positionX, positionY, idByClass, idParentContainer);
        this.stopPosition = Math.floor(Math.random()*30);
    }
    
}

const game = new Game();
game.start();