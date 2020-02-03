let ducks = [],
  duckSprite,
  FLOOR
function preload() {
  duckSprite = loadImage("../assets/dh-logo.png")
}
function setup() {
  const canvas = createCanvas(windowWidth, windowHeight)
  FLOOR = windowHeight / 2
  canvas.parent("exciting-bg")
  //   background(255, 45, 72)
  for (let i = 0; i < 10; i++) {
    ducks.push(new Duck())
  }
}
function draw() {
  background(0)
  fill(52, 131, 235)
  strokeWeight(4)
  stroke(82, 157, 255)
  rect(0, FLOOR, windowWidth, FLOOR)

  for (let duck of ducks) {
    duck.display()
    duck.update()
    duck.checkEdges()
  }
}

class Duck {
  constructor() {
    this.floor = FLOOR - duckSprite.height + 100
    this.position = createVector(windowWidth - duckSprite.width, this.floor)
    this.velocity = createVector(0, 0)
    this.acceleration = createVector(0, 0)

    //Resistive forces
    this.gravity = createVector(0, 0.1)
    this.friction = createVector(1.9, 0)

    //Its in your DNA to hop and paddle every so often
    setTimeout(() => {
      this.hop()
    }, random(1000, 3000))
    // setTimeout(() => {
    //   this.paddle()
    // }, random(1000, 3000))
  }
  hop() {
    this.acceleration.add(0, -2)
    this.velocity.add(this.acceleration)
    this.position.add(this.velocity)
  }
  paddle() {
    // this.acceleration.add(this.friction)
    this.acceleration.add(-2, 0)
    this.velocity.add(this.acceleration)
    this.position.add(this.velocity)
  }
  checkEdges() {
    if (this.position.y > this.floor) {
      this.position.y = this.floor
    }
  }
  update() {
    //Resistive forces
    this.acceleration.add(this.gravity)

    this.velocity.add(this.acceleration)
    this.position.add(this.velocity)
    this.acceleration.mult(0, 0)
  }
  display() {
    fill(255, 204, 0)
    image(duckSprite, this.position.x, this.position.y)
  }
}
