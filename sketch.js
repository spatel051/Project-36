var dog, sadDog, happyDog;
var feedButton, addButton;
var fedTime, lastFed;
var food;
var database;

function preload(){
  sadDog = loadImage("Dog.png");
  happyDog = loadImage("happy dog.png");
}

function setup(){
  database = firebase.database();
  createCanvas(1000, 400);
  
  food = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  dog = createSprite(800, 200, 150, 150);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  feedButton = createButton("Feed the Dog");
  feedButton.position(600, 100);
  feedButton.mousePressed(feedDog);

  addButton = createButton("Add Food");
  addButton.position(700,100);
  addButton.mousePressed(addFood);
}

function draw() {
  background(46,139,87);

  food.display();

  fedTime = database.ref('FeedTime');

  fedTime.on("value", function(data){
    lastFed = data.val();
  });

  fill(255, 255, 254);
  textSize(15);
  
  if(lastFed >= 12){
    text("Last Feed: " + lastFed % 12 + " PM", 250, 30);
  }

  else if(lastFed == 0){
     text("Last Feed: 12 AM", 250, 30);
  }

  else {
     text("Last Feed: " + lastFed + " AM", 250, 30);
  }

  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS = data.val();
  food.updateFoodStock(foodS);
}

//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);
  
  if(food.getFoodStock() <= 0) {
    food.updateFoodStock(food.getFoodStock() * 0);
  }
  else {
    food.updateFoodStock(food.getFoodStock() - 1);
  }
  
  database.ref('/').update({
    Food: food.getFoodStock(),
    FeedTime: hour()
  })
}

//function to add food in stock
function addFood(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
