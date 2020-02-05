let ducksFromRight = [],
  ducksFromLeft = [],
  duckSprite,
  duckSpriteRev,
  FLOOR
function preload() {
  duckSprite = loadImage("../assets/dh-logo.png")
  duckSpriteRev = loadImage("../assets/dh-logo-rev.png")
}
function setup() {
  const canvas = createCanvas(windowWidth, windowHeight)
  FLOOR = windowHeight / 2
  canvas.parent("ducks")
  for (let i = 0; i < 10; i++) {
    ducksFromRight.push(new Duck(duckSprite, 1))
  }
  for (let i = 0; i < 10; i++) {
    ducksFromLeft.push(new Duck(duckSpriteRev, -1))
  }
}
function draw() {
  clear()
  fill(52, 131, 235)
  strokeWeight(4)
  stroke(82, 157, 255)
  rect(0, FLOOR, windowWidth, FLOOR)

  for (let duck of ducksFromRight) {
    duck.display()
    duck.update()
    duck.checkEdges()
  }
  for (let duck of ducksFromLeft) {
    duck.display()
    duck.update()
    duck.checkEdges()
  }
}

class Duck {
  constructor(img, flip) {
    this.floor = FLOOR - duckSprite.height + 100
    flip == 1
      ? (this.position = createVector(windowWidth, this.floor))
      : (this.position = createVector(-200, this.floor))
    this.velocity = createVector(0, 0)
    this.acceleration = createVector(0, 0)
    this.sprite = img
    this.flip = flip

    //Resistive forces
    this.gravity = createVector(0, 0.1)
    this.friction = createVector(1.9, 0)

    //Its in your DNA to hop and paddle every so often
    setTimeout(() => {
      this.hop()
    }, random(1000, 5000))
    setTimeout(() => {
      this.paddle()
    }, random(1000, 5000))
  }
  hop() {
    this.acceleration.add(0, -2)
    this.velocity.add(this.acceleration)
    this.position.add(this.velocity)
  }
  paddle() {
    // this.acceleration.add(this.friction)
    this.acceleration.add(-2 * this.flip, 0)
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
  }
}
