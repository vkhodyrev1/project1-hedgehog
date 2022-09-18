class Game {
    constructor (){
        this.hadgehog = null; //will store an instance of the class Player
        this.apples = []; //will store instances of the class Obstacle
        this.applesDropped = [];
    }
    start() {
        this.hadgehog = new Hadgehog (10, 10, 50, 0, "hadgehog", "board");
        this.attachEventListeners();
        
        let appleWidth = 5;
        let appleHeigth = appleWidth;
        
        if (this.applesDropped.length === 0) {
            //console.log(this.applesDropped);
            const applesAppear = setInterval(() => {
                
                let randomAppleX = Math.floor(Math.random()*(51 - appleWidth) + 50);
                let randomAppleY = Math.floor(Math.random()*(61 - appleHeigth) + 40);
                const appleInstance = new Apple(5, appleWidth, randomAppleX, randomAppleY, "apple", "board");
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
                    //clearInterval(applesDrop);
                    //apple.domElement.remove();
                    
                    //console.log(this.apples);
                    apple.movingDown();
                    
                } else {
                    this.applesDropped.push(this.apples.splice(index, 1)[0]);
                    //if (this.applesDropped.length === this.apples.length) {
                    //    console.log(this.apples.length);
                    //    //this.apples = [];
                    //    //console.log(apple);
                    //    clearInterval(applesDrop);
                    //    
                    //} else {
                    //    this.applesDropped.push(this.apples[index]);
                    //}
                }
                
                //console.log(apple);
            })
            
            //console.log(this.apples);
            //console.log(this.applesDropped);
        }, 60);
    }

    attachEventListeners () {
        let shaked = false;
        let pickedUp;
        document.addEventListener("keydown", (event) => {
            
                //let tree = document.getElementById("container"); 
                //let treeMiddle = (tree.getBoundingClientRect().right - tree.getBoundingClientRect().left)/2 + tree.getBoundingClientRect().left;
            if (event.key === "ArrowLeft") {
                this.hadgehog.movingLeft();
                
                if (this.detectCollisionTree(this.hadgehog) && !shaked) {
                    
                    this.shakeTree();
                    shaked = true;
                } else  if (pickedUp === undefined) {
                    console.log(this.applesDropped);
                    this.applesDropped.forEach((droppedApple, index)  => {
                        if (this.detectCollisionApple(droppedApple)) {
                            console.log(droppedApple);
                            pickedUp = index;

                        };
                        
                    })    
                } else {
                    this.hadgehog.pickUp(this.applesDropped[pickedUp], this.hadgehog);
                }
            } else if (event.key === "ArrowRight"){
                this.hadgehog.movingRight();
                
                if (this.detectCollisionTree(this.hadgehog) && !shaked) {
                    
                    this.shakeTree();
                    shaked = true;
                } else  if (pickedUp === undefined) {
                    console.log(this.applesDropped);
                    this.applesDropped.forEach((droppedApple, index)  => {
                        if (this.detectCollisionApple(droppedApple)) {
                            console.log(droppedApple);
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
    detectCollisionTree(playerInstance) {
        let tree = document.getElementById("container"); 
            let treeMiddle = ((tree.getBoundingClientRect().right - tree.getBoundingClientRect().left)/2 + 
            tree.getBoundingClientRect().left)*100/window.innerWidth;
            if (playerInstance.positionX -2 < treeMiddle && 
                playerInstance.positionX + 4 > treeMiddle && playerInstance.positionY > 3) {
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
                //console.log(this.hadgehog.positionX+'..<..'+playerInstance.positionX+'..+..'+playerInstance.width+'..&..'+
                //    this.hadgehog.positionX+'..+..'+this.hadgehog.width+'..>..'+playerInstance.positionX+'..&..'+
                //    this.hadgehog.positionY+'..<..'+playerInstance.positionY+'..+..'+playerInstance.height+'..&..'+
                //    this.hadgehog.height+'..+..'+this.hadgehog.positionY+'..>..'+playerInstance.positionY);
            //console.log(playerInstance);
            return true;
        } else {
            return false;
        }
    }
/*
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
                //console.log(playerInstance);
                return true;
            } else {
                return false;
            }
        }           
    }
*/

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
    pickUp (pickedUpApple, hadgehogDriver) {
        pickedUpApple.positionX = hadgehogDriver.positionX;
        pickedUpApple.positionY = hadgehogDriver.positionY;
        pickedUpApple.domElement.style.left = pickedUpApple.positionX + "%";
        pickedUpApple.domElement.style.bottom = pickedUpApple.positionY + "vh";
        //pickedUpApple.movingLeft = this.movingLeft;

        //pickedUpApple.movingRight = this.movingRight;
        //pickedUpApple.movingDown = this.movingDown;
        //pickedUpApple.movingUp = this.movingUp;

        console.log("Im picked up ...");
        console.log(pickedUpApple);
        //pickedUpApple = this.hadgehog;
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