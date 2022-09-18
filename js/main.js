class Game {
    constructor (){
        this.hadgehog = null; //will store an instance of the class Player
        this.apples = []; //will store instances of the class Obstacle
        this.applesDropped = [];
    }
    start() {
        this.hadgehog = new Hadgehog (15, 15, 50, 0, "hadgehog", "board");
        this.attachEventListeners();
        
        let appleWidth = 8;
        let appleHeigth = appleWidth;
        
        if (this.applesDropped.length === 0) {
            //console.log(this.applesDropped);
            const applesAppear = setInterval(() => {
                
                let randomAppleX = Math.floor(Math.random()*(51 - appleWidth) + 50);
                let limitY = 60 - (randomAppleX - 75)**2/10;
                let randomAppleY = Math.floor(Math.random()*(limitY - appleHeigth) + 40);
                const appleInstance = new Apple(appleHeigth, appleWidth, randomAppleX, randomAppleY, "apple", "board");
                this.apples.push(appleInstance);
                if (this.apples.length >10) {
                    clearInterval(applesAppear);
                }
                
            }, 10);
        }
        
    }

    shakeTree () {
        const applesDrop = setInterval(() => {
            this.apples.forEach((apple, index) => {
                //apple.movingDown();
                
                if (apple.positionY > apple.stopPosition) {
                    apple.movingDown();
                    
                } else {
                    this.applesDropped.push(this.apples.splice(index, 1)[0]);
                }
            })
        }, 60);
    }

    attachEventListeners () {
        let shaked = false;
        let pickedUp;
        let score = 0;
        let corner = false;
        let leftSideTree = false;
        document.addEventListener("keydown", (event) => {
            
            if (event.key === "ArrowLeft") {
                if (!corner) {
                    this.hadgehog.movingLeft();
                    leftSideTree = false;
                }
                    
                if (this.detectCollisionTree(this.hadgehog, "redapple") && !shaked) {
                    corner = true;
                    this.shakeTree();
                    shaked = true;
                } else  if (pickedUp === undefined) {
                    //console.log(this.applesDropped);
                    this.applesDropped.forEach((droppedApple, index)  => {
                        if (this.detectCollisionApple(droppedApple)) {
                            //console.log(droppedApple);
                            pickedUp = index;

                        };
                        
                    })    
                } else {
                    
                    if (this.detectCollisionTree(this.hadgehog, "corner") && !corner) {
                        //console.log("I'm in the corner ...");
                        this.applesDropped[pickedUp].positionX = 0;
                        this.applesDropped[pickedUp].positionY = pickedUp*this.applesDropped[pickedUp].height;
                        this.applesDropped[pickedUp].domElement.style.left = this.applesDropped[pickedUp].positionX + "%";
                        this.applesDropped[pickedUp].domElement.style.bottom = this.applesDropped[pickedUp].positionY + "vh";
                        corner = true;
                        pickedUp = undefined;
                        score += 5;
                        document.querySelector("h2 span").innerText = score + " points";
                    } else {
                        this.hadgehog.pickUp(this.applesDropped[pickedUp], this.hadgehog);
                    }
                    
                }
            } else if (event.key === "ArrowRight"){
                if (!leftSideTree) {
                    this.hadgehog.movingRight();
                    corner = false;
                }
                if (this.detectCollisionTree(this.hadgehog, "redapple") && !shaked) {
                    leftSideTree = true;
                    this.shakeTree();
                    shaked = true;
                } else  if (pickedUp === undefined) {
                    //console.log(this.applesDropped);
                    this.applesDropped.forEach((droppedApple, index)  => {
                        if (this.detectCollisionApple(droppedApple)) {
                            //console.log(droppedApple);
                            pickedUp = index;

                        };
                        
                    })    
                } else {
                    this.hadgehog.pickUp(this.applesDropped[pickedUp], this.hadgehog);
                }

            }
            if(event.key === "ArrowDown"){
                this.hadgehog.movingDown();
                if (pickedUp >= 0) {
                    this.hadgehog.pickUp(this.applesDropped[pickedUp], this.hadgehog);
                }
            }else if(event.key === "ArrowUp"){
                this.hadgehog.movingUp();
                if (pickedUp >= 0) {
                    this.hadgehog.pickUp(this.applesDropped[pickedUp], this.hadgehog);
                }
            }
            
        });
    }
    detectCollisionTree(playerInstance, target) {
        let tree = document.getElementById(target); 
            let treeMiddle = ((tree.getBoundingClientRect().right - tree.getBoundingClientRect().left)/2 + 
            tree.getBoundingClientRect().left)*100/window.innerWidth;
            if (playerInstance.positionX -2 < treeMiddle && 
                playerInstance.positionX + 4 > treeMiddle && playerInstance.positionY > 1 && playerInstance.positionY < 10) {
                    
                    return true;
                } else {
                    return false;
                }
            
    }
    detectCollisionApple(playerInstance) {
        if (this.hadgehog.positionX < playerInstance.positionX + playerInstance.width &&
            this.hadgehog.positionX + this.hadgehog.width > playerInstance.positionX &&
            this.hadgehog.positionY < playerInstance.positionY + playerInstance.height &&
            this.hadgehog.height + this.hadgehog.positionY > playerInstance.positionY) {
            //console.log("I'm in the collision ...");
            return true;
        } else {
            return false;
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
        if (this.positionX > 0) {
            this.positionX--;
            this.domElement.style.left = this.positionX + "%";
        } else {
            this.positionX = 0;
        }
    }

    movingRight() {
        if (this.positionX < 95) {
            this.positionX++;
            this.domElement.style.left = this.positionX + "%";
    } else {
        this.positionX = 100;
    }
    }

    movingDown() {
        if (this.positionY > 0) {
            this.positionY--;
            this.domElement.style.bottom = this.positionY + "vh";
        } else {
        this.positionY = 0;
    }
    }

    movingUp() {
    if (this.positionY < 100-this.height) {
        this.positionY++;
        this.domElement.style.bottom = this.positionY + "vh";
    } else {
        this.positionY = 100;
    }
    }
}

class Hadgehog extends MovingParts {
    constructor (height, width, positionX, positionY, idByClass, idParentContainer){
        super(height, width, positionX, positionY, idByClass, idParentContainer);
      
    }
    pickUp (pickedUpApple, hadgehogDriver) {
        pickedUpApple.positionX = hadgehogDriver.positionX;
        pickedUpApple.positionY = hadgehogDriver.positionY;
        pickedUpApple.domElement.style.left = pickedUpApple.positionX + "%";
        pickedUpApple.domElement.style.bottom = pickedUpApple.positionY + "vh";
        
        //console.log("Im picked up ...");
        //console.log(pickedUpApple);
        
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