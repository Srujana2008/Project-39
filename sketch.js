/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var jungle, invisiblejungle;

var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;

function preload(){
  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(800, 400);

  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.3
  jungle.x = width /2;

  kangaroo = createSprite(100, 280);
  kangaroo.addAnimation("running", kangaroo_running);
  kangaroo.addAnimation("collided", kangaroo_collided);
  kangaroo.changeAnimation("running");
  kangaroo.scale = 0.15;
  //kangaroo.debug = true;
  kangaroo.setCollider("circle", -60, 0, 500);

  invisibleGrd = createSprite(0, 390, width*2, 10);
  invisibleGrd.visible = false;

  shrubsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;

  restart = createSprite(width/2, height/2 + 50, 10, 10);
  restart.addImage(restartImg);
  restart.scale = 0.1;  
  restart.visible = false;
  
  gameOver = createSprite(width/2, height/2-40);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;

}

function draw() {
  background(255);
  
  kangaroo.x = camera.position.x-270;
  kangaroo.collide(invisibleGrd);

  jungle.velocityX = -5;

    if(jungle.x < 100){
      jungle.x = 400;
    }

  if (gameState === PLAY){

    if(keyDown("space") && kangaroo.y > 200){
      jumpSound.play();
      kangaroo.velocityY = -18;
    }
    kangaroo.velocityY = kangaroo.velocityY + 0.8;
    
    spawnShrubs();
    spawnObstacles();

    if(shrubsGroup.isTouching(kangaroo)){
      score = score + 1;
      shrubsGroup.destroyEach();
    }

    if(obstaclesGroup.isTouching(kangaroo)){
      collidedSound.play();
      gameState = END;
    }
  }

  drawSprites();

  if(gameState === END){
    gameOver.visible = true;
    kangaroo.changeAnimation("collided");
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
    kangaroo.velocityY = 0;
    restart.visible = true;
    if(mousePressedOver(restart)){
      restartGame();
    }
  }

  stroke("white");
  strokeWeight(5);
  fill("black");
  textSize(30);
  text("Score: "+ score, camera.position.x+250, 50);

  if(score >= 5){
    kangaroo.visible = false;
    strokeWeight(10);
    stroke("black");
    fill("white");
    text("Congratulations!", width/2-100, height/2-40);
    text("You win the game!",width/2-115, height/2);
    shrubsGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    jungle.velocityX = 0;
    restart.visible = true;
    if(mousePressedOver(restart)){
      restartGame();
    }
  }

}

function spawnShrubs(){
  if(frameCount % 150 === 0){
    var shrub = createSprite(camera.position.x+500, 350, 40, 10);
    shrub.velocityX = -7;
    shrub.scale = 0.08;
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: shrub.addImage(shrub1);
              break;
      case 2: shrub.addImage(shrub2); 
              break;
      case 3: shrub.addImage(shrub3);
              break;
      default: break;
    }
    shrub.lifetime = 320;
    shrubsGroup.add(shrub);
  }

}

function spawnObstacles(){
  if(frameCount % 200 === 0){
    var obstacle = createSprite(camera.position.x+500, 350, 40, 20);
    obstacle.velocityX = -7;
    obstacle.addImage(obstacle1);
    obstacle.scale = 0.2;
    obstacle.lifetime = 320;
    //obstacle.debug = true;
    obstacle.setCollider("circle", 0, 0, 220);
    obstaclesGroup.add(obstacle);
  }

}

function restartGame(){
  kangaroo.visible = true;
  gameState = PLAY;
  gameOver.visible = false;
  obstaclesGroup.setLifetimeEach(0);
  shrubsGroup.setLifetimeEach(0);
  restart.visible = false;
  kangaroo.changeAnimation("running");
  kangaroo.x = camera.position.x-270;
  kangaroo.collide(invisibleGrd);
  score = 0;

  jungle.velocityX = -5;

    if(jungle.x < 100){
      jungle.x = 400;
    }
  if(keyDown("space") && kangaroo.y > 200){
    jumpSound.play();
    kangaroo.velocityY = -18;
  }
  kangaroo.velocityY = kangaroo.velocityY + 0.8;
  
  spawnShrubs();
  spawnObstacles();

  if(shrubsGroup.isTouching(kangaroo)){
    score = score + 1;
    shrubsGroup.destroyEach();
  }

  if(obstaclesGroup.isTouching(kangaroo)){
    collidedSound.play();
    gameState = END;
  }
}