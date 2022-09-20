class Game {
    constructor (){
        this.hadgehog = null; //will store an instance of the class Player
        this.apples = []; //will store instances of the class Obstacle
        this.applesDropped = [];
        this.obstacles = [];
    }
    start() {
        let sizes = [
            {
                width: 15,
                heigth: 15
            },
            {
                width: 8,
                heigth: 8
            },
            {
                width: 15,
                heigth: 10
            }
        ]
        if (window.innerWidth >= window.innerHeight) {
            sizes.forEach((widthItem) => {
                widthItem.width = widthItem.width*window.innerHeight/window.innerWidth;
                //console.log(widthItem.width);
                //console.log(sizes);
            })
        } else {
            sizes.forEach((heightItem) => {
                heightItem.heigth = heightItem.heigth*window.innerWidth/window.innerHeight;
            })
        }
        //console.log(sizes);
        this.hadgehog = new Hadgehog (sizes[0].heigth, sizes[0].width, sizes[0].width, 0, "hadgehog", "board", "url('/project1-hedgehog/images/hadgehogHome.png");
        this.attachEventListeners();

        if (this.applesDropped.length === 0) {
            //console.log(this.applesDropped);
            const applesAppear = setInterval(() => {
                
                let randomAppleX = Math.floor(Math.random()*(45 - sizes[1].width) + 52);
                let limitY = 60 - (randomAppleX - 75)**2/10;
                let randomAppleY = Math.floor(Math.random()*(limitY - sizes[1].heigth) + 40);
                const appleInstance = new Apple(sizes[1].heigth, sizes[1].width, randomAppleX, randomAppleY, "apple", "board", "url('/project1-hedgehog/images/apple.png')");
                this.apples.push(appleInstance);
                if (this.apples.length > 10) {
                    clearInterval(applesAppear);
                }
            }, 10);
        }

        
        const obstaclesAppear = setInterval(() => {
            let randomObstacleX = Math.floor(Math.random()*40 + 10);
            const obstacleInstance = new MovingParts(sizes[2].heigth, sizes[2].width, randomObstacleX, 100, "obstacle", "board", "url('/project1-hedgehog/images/owl.png')");
            if (this.obstacles.length < 10) {
                this.obstacles.push(obstacleInstance);
            }
        }, 2000)
    
        
        const obstaclesDrop = setInterval(() => {
            this.obstacles.forEach((obstacle) => {
                //console.log(obstacle);
                
                obstacle.movingDown();
                if (this.detectCollisionApple(obstacle)) {
                    clearInterval(obstaclesDrop);
                    clearInterval(obstaclesAppear);
                    location.href = 'gameover.html';
                    
                } else    
                if (obstacle.positionY <= 0) {
                    obstacle.domElement.remove();
                    this.obstacles.shift();
                    
                }
                    
                
            })
        }, 60);
    }
    
    shakeTree () {
        const applesDrop = setInterval(() => {
            this.apples.forEach((apple, index) => {
              
                if (apple.positionY > apple.stopPosition) {
                    apple.movingDown();
                    
                } else {
                    this.applesDropped.push(this.apples.splice(index, 1)[0]);
                }
            })
            if (this.apples === []) {
                clearInterval(applesDrop);
            }
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
                    this.hadgehog.backgroundImage = "url('/project1-hedgehog/images/hadgehogMoveLeft.png";
                    this.hadgehog.movingLeft();
                    leftSideTree = false;
                }
                    
                if (this.detectCollisionTree(this.hadgehog, "redapple") && !shaked) {
                    corner = true;
                    this.shakeTree();
                    shaked = true;
                } else  if (pickedUp === undefined && this.hadgehog.positionX > this.hadgehog.width*3) {
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
                        this.applesDropped[pickedUp].domElement.style.left = this.applesDropped[pickedUp].positionX + "vw";
                        this.applesDropped[pickedUp].domElement.style.bottom = this.applesDropped[pickedUp].positionY + "vh";
                        corner = true;
                        pickedUp = undefined;
                        score += 5;
                        document.querySelector("h2 span").innerText = score + " points";
                        if (score === this.applesDropped.length*5) {
                            location.href = 'win.html';
                        }
                    } else {
                        
                        this.hadgehog.pickUp(this.applesDropped[pickedUp], this.hadgehog);
                    }
                    
                }
            } else if (event.key === "ArrowRight"){
                if (!leftSideTree) {
                    this.hadgehog.backgroundImage = "url('/project1-hedgehog/images/hadgehogMoveRight.png";
                    this.hadgehog.movingRight();
                    
                    console.log(this.hadgehog.backgroundImage);
                    corner = false;
                }
                if (this.detectCollisionTree(this.hadgehog, "redapple") && !shaked) {
                    
                    leftSideTree = true;
                    this.shakeTree();
                    shaked = true;
                } else  if (pickedUp === undefined && this.hadgehog.positionX > this.hadgehog.width*3) {
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
                this.hadgehog.backgroundImage = "url('/project1-hedgehog/images/hadgehogDown1.png";
                this.hadgehog.movingDown();
                //if (pickedUp >= 0) {
                    this.hadgehog.pickUp(this.applesDropped[pickedUp], this.hadgehog);
                //}
            }else if(event.key === "ArrowUp"){
                this.hadgehog.backgroundImage = "url('/project1-hedgehog/images/hadgehogUp1.png";
                //this.hadgehog.movingUp();
                if (this.hadgehog.positionY < 27) {
                    this.hadgehog.movingUp();
                    this.hadgehog.pickUp(this.applesDropped[pickedUp], this.hadgehog);
                }
            }
            
        });
    }
    detectCollisionTree(playerInstance, target) {
        let tree = document.getElementById(target); 
        let treeMiddle = ((tree.getBoundingClientRect().right - tree.getBoundingClientRect().left)/2 + 
        tree.getBoundingClientRect().left)*100/window.innerWidth;
        //console.log(tree.getBoundingClientRect().right);
        //console.log(tree.getBoundingClientRect().left);
        //console.log(treeMiddle);

        if (playerInstance.positionX < treeMiddle && 
            playerInstance.positionX + playerInstance.width*1.2 > treeMiddle && playerInstance.positionY > 1 && playerInstance.positionY < 10) {
                
                return true;
            } else {
                return false;
            } 
    }
    detectCollisionApple(playerInstance) {
        if (this.hadgehog.positionX < playerInstance.positionX + playerInstance.width &&
            this.hadgehog.positionX + this.hadgehog.width*0.8 > playerInstance.positionX &&
            this.hadgehog.positionY < playerInstance.positionY + playerInstance.height &&
            this.hadgehog.height*0.8 + this.hadgehog.positionY > playerInstance.positionY) {
            //console.log("I'm in the collision ...");
            return true;
        } else {
            return false;
        }
    }

}

class MovingParts {
    constructor (height, width, positionX, positionY, idByClass, idParentContainer, backgroundImage){
        this.height = height;
        this.width = width;
        this.positionX = positionX;
        this.positionY = positionY;
        this.domElement = null;
        this.idByClass = idByClass;
        this.idParentContainer = idParentContainer;
        this.backgroundImage = backgroundImage;

        this.createDomElement();
    }

    createDomElement(){
        // create dom element
        this.domElement = document.createElement('div');
        // set id and css
        
        //if (window.innerWidth >= window.innerHeight) {
        //    this.domElement.style.width = this.height + "vh";
        //    this.domElement.style.height = this.height + "vh";
        //} else {
        //    this.domElement.style.width = this.width + "vw";
        //    this.domElement.style.height = this.width + "vw";
        //}
        this.domElement.style.width = this.width + "vw";
        this.domElement.style.height = this.height + "vh";
        this.domElement.className = this.idByClass;
        this.domElement.style.bottom = this.positionY + "vh";
        this.domElement.style.left = this.positionX + "vw";
        this.domElement.style.backgroundImage = this.backgroundImage;//"url('/oop-game-codealong/images/player-left.png')"
        // append to the dom
        const boardElm = document.getElementById(this.idParentContainer);
        boardElm.appendChild(this.domElement)
    }

    movingLeft() {
        if (this.positionX > 0) {
            this.positionX--;
            this.domElement.style.left = this.positionX + "vw";
        } else {
            this.positionX = 0;
        }
        this.domElement.style.backgroundImage = this.backgroundImage;
    }

    movingRight() {
        if (this.positionX < 100 - this.width) {
            this.positionX++;
            this.domElement.style.left = this.positionX + "vw";
        } else {
            this.positionX = 100- this.width;
        }
        this.domElement.style.backgroundImage = this.backgroundImage;
    }

    movingDown() {
        if (this.positionY > 0) {
            this.positionY--;
            this.domElement.style.bottom = this.positionY + "vh";
        } else {
            this.positionY = 0;
        }
        this.domElement.style.backgroundImage = this.backgroundImage;
    }

    movingUp() {
        if (this.positionY < 100 - this.height) {
            this.positionY++;
            this.domElement.style.bottom = this.positionY + "vh";
        } else {
            this.positionY = 100 - this.height;
        }
        this.domElement.style.backgroundImage = this.backgroundImage;
    }
}

class Hadgehog extends MovingParts {
    constructor (height, width, positionX, positionY, idByClass, idParentContainer, backgroundImage){
        super(height, width, positionX, positionY, idByClass, idParentContainer, backgroundImage);
      
    }
    pickUp (pickedUpApple, hadgehogDriver) {
        pickedUpApple.positionX = hadgehogDriver.positionX + (hadgehogDriver.width - pickedUpApple.width)/2;
        pickedUpApple.positionY = hadgehogDriver.positionY + hadgehogDriver.height/2;
        pickedUpApple.domElement.style.left = pickedUpApple.positionX + "vw";
        pickedUpApple.domElement.style.bottom = pickedUpApple.positionY + "vh";
        
        //console.log("Im picked up ...");
        //console.log(pickedUpApple);
        
    }
}

class Apple extends MovingParts {
    constructor (height, width, positionX, positionY, idByClass, idParentContainer, backgroundImage){
        super(height, width, positionX, positionY, idByClass, idParentContainer, backgroundImage);
        this.stopPosition = Math.floor(Math.random()*27);
    }
    
}

const game = new Game();
game.start();