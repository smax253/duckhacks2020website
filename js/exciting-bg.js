let ducksFromRight = [],
  ducksFromLeft = [],
  duckSprite,
  duck,
  terminusFont
let leftBuildingRowBackground = [],
  rightBuildingRowBackground = [],
  leftBuildingRowForeground = [],
  rightBuildingRowForeground = []
// World constants
const FLOOR = window.innerHeight / 2
const HALF_DUCKS_PER_ROW = 4

const CODE_SNIPPETS = [
  'console.log("DUCKHACKS IS FOR THE KIDS")',
  "function sayMyNameSayMyName() {\n\twhen(noOneIsAroundYou) {\n\tsay.babyILoveYou()\n}\n}"
]

function preload() {
  duckSprite = loadImage("../assets/dh-logo.png")
  terminusFont = loadFont("../assets/TerminusTTF-4.47.0.ttf")
  // duckSpriteRev = loadImage("../assets/dh-logo-rev.png")
}
function setup() {
  const canvas = createCanvas(windowWidth, windowHeight)
  canvas.parent("ducks")
  buildBuildings()
  duck = new Duck()
  // for (let i = 0; i < 10; i++) {
  //   ducksFromRight.push(new Duck(duckSprite, 1))
  // }
  // for (let i = 0; i < 10; i++) {
  //   ducksFromLeft.push(new Duck(duckSpriteRev, -1))
  // }
}
function draw() {
  background(0)
  fill(52, 131, 235)
  strokeWeight(4)
  stroke(82, 157, 255)
  duck.display()
  duck.update()
  duck.checkEdges()
  // displayBackgroundBuildings()
  // for (let duck of ducksFromRight) {
  //   duck.display()
  //   duck.update()
  //   duck.checkEdges()
  // }
  // for (let duck of ducksFromLeft) {
  //   duck.display()
  //   duck.update()
  //   duck.checkEdges()
  // }
  // displayForegroundBuildings()
}

function buildBuildings() {
  for (let i = 0; i < HALF_DUCKS_PER_ROW; i++) {
    leftBuildingRowBackground.push(
      new Building((windowWidth / 10) * i + windowWidth / 10, windowHeight / 2)
    )
  }
  for (let i = HALF_DUCKS_PER_ROW * 2; i > HALF_DUCKS_PER_ROW; i--) {
    rightBuildingRowBackground.push(
      new Building((windowWidth / 10) * i + windowWidth / 10, windowHeight / 2)
    )
  }
  for (let i = 0; i < HALF_DUCKS_PER_ROW; i++) {
    leftBuildingRowForeground.push(
      new Building(
        (windowWidth / 10) * i + windowWidth / 10,
        windowHeight - windowHeight / 4
      )
    )
  }
  for (let i = HALF_DUCKS_PER_ROW * 2; i > HALF_DUCKS_PER_ROW; i--) {
    rightBuildingRowForeground.push(
      new Building(
        (windowWidth / 10) * i + windowWidth / 10,
        windowHeight - windowHeight / 4
      )
    )
  }
}

function displayBackgroundBuildings() {
  for (let building of leftBuildingRowBackground) {
    building.display()
    building.buildLeftBuilding()
  }
  for (let building of rightBuildingRowBackground) {
    building.display()
    building.buildRightBuilding()
  }
}

function displayForegroundBuildings() {
  for (let building of leftBuildingRowForeground) {
    building.display()
    building.buildLeftBuilding()
  }
  for (let building of rightBuildingRowForeground) {
    building.display()
    building.buildRightBuilding()
  }
}

class Duck {
  constructor() {
    this.floor = FLOOR - duckSprite.height + 100
    this.position = createVector(windowWidth, this.floor)
    this.velocity = createVector(0, 0)
    this.acceleration = createVector(0, 0)
    this.sprite = duckSprite
    this.speed = -3
    this.flip = 1
    this.text = random(CODE_SNIPPETS)
    this.displayText()

    //Resistive forces
    this.gravity = createVector(0, 0.1)
    this.friction = createVector(1.9, 0)

    this.paddle()
  }
  displayText() {
    noStroke()
    fill(0)
    textFont(terminusFont)
    textSize(40)
    this.snippet = text(
      this.text,
      this.position.x + this.sprite.width,
      this.position.y + this.sprite.height / 2
    )
  }
  hop() {
    this.acceleration.add(0, -2)
    this.velocity.add(this.acceleration)
    this.position.add(this.velocity)
  }
  paddle() {
    // this.acceleration.add(this.friction)
    this.acceleration.add(this.speed * this.flip, 0)
    this.velocity.add(this.acceleration)
    this.position.add(this.velocity)
  }
  checkEdges() {
    if (this.position.y > this.floor) {
      this.velocity.y *= -0.9
      this.position.y = this.floor
    }
  }
  update() {
    //Resistive forces
    this.acceleration.add(this.gravity)

    this.velocity.add(this.acceleration)
    this.position.add(this.velocity)
    this.acceleration.mult(0)
  }
  display() {
    fill(255, 204, 0)
    image(this.sprite, this.position.x, this.position.y)

    noStroke()
    fill(255, 255, 0)
    rect(
      this.position.x + this.sprite.width,
      this.position.y + this.sprite.height / 2 + 10,
      textWidth(this.text),
      -textAscent(this.text) * 1.2
    )
    this.displayText()
    if (this.position.x < 0 && this.flip == 1) {
      console.log("in my duff")
      this.flip = -1
      // this.text = random(CODE_SNIPPETS)
    }
  }
}

class Building {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.width = windowWidth / 20
    this.height = random(-200, -100)

    this.frontColor = [145, 19, 19]
    this.sideColor = [199, 28, 28]
  }
  buildLeftBuilding() {
    fill(this.sideColor)
    //Side of building
    quad(
      this.x + this.width * 1.5,
      this.y + this.height / 4,
      this.x + this.width,
      this.y,
      this.x + this.width,
      this.y + this.height,
      this.x + this.width * 1.5,
      this.y + this.height * 1.25
    )
    //Roof of building
    quad(
      this.x,
      this.y + this.height,
      this.x + this.width / 2,
      this.y + this.height * 1.25,
      this.x + this.width * 1.5,
      this.y + this.height * 1.25,
      this.x + this.width,
      this.y + this.height
    )
  }
  buildRightBuilding() {
    fill(this.sideColor)
    //Side of building
    quad(
      this.x,
      this.y,
      this.x - this.width / 2,
      this.y + this.height / 4,
      this.x - this.width / 2,
      this.y + this.height * 1.25,
      this.x,
      this.y + this.height
    )
    //Roof of building
    quad(
      this.x,
      this.y + this.height,
      this.x - this.width / 2,
      this.y + this.height * 1.25,
      this.x + this.width / 2,
      this.y + this.height * 1.25,
      this.x + this.width,
      this.y + this.height
    )
  }
  buildFrontWindows() {
    fill(0)
    this.dividingScale = 5
    this.windowWidth = this.width / this.dividingScale
    this.windowHeight = this.height / this.dividingScale
    this.windowRootX = this.x
    this.windowRootY = this.y
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        rect(
          this.windowRootX +
            this.windowWidth * x * (this.dividingScale / 4) +
            this.windowWidth / (this.dividingScale + 4),
          this.windowRootY +
            this.windowHeight * y * (this.dividingScale / 4) +
            this.windowHeight / (this.dividingScale + 4),
          this.windowWidth,
          this.windowHeight
        )
      }
    }
  }
  display() {
    noStroke()
    fill(this.frontColor)
    rect(this.x, this.y, this.width, this.height)
    this.buildFrontWindows()
  }
}

function sayMyNameSayMyName() {
  while (noOneIsAroundYou) {
    you.aintRunningGame() ? say.babyILoveYou() : null
  }
}

let array1 = ["apple", "orange"]
let array2 = ["beagle", "labrador"]
array1.push("banana")
array2.pop()
