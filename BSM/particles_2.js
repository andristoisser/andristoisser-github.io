let particles = [];

function setup() {
  canvas = createCanvas(windowWidth, document.body.scrollHeight);
  canvas.position(0, 0);
  background(0, 0);
}

function draw() {
  clear();

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }
}

function mouseMoved() {
  let particle = new Particle(mouseX, mouseY);
  particles.push(particle);
}

function windowResized() {
  resizeCanvas(windowWidth, document.body.scrollHeight);
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocityX = random(-1, 2);
    this.velocityY = random(-1, 3);
    this.alpha = random(50, 255);
    this.size = random(2, 5);
    this.lifespan = random(30, 100);
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.alpha -= random(0.5, 5);
    this.size -= random(0.01, 0.03);
    this.lifespan -= 0.5;
  }

  display() {
    noStroke();
    fill(255, this.alpha);
    ellipse(this.x, this.y, this.size, this.size);
  }

  isFinished() {
    return this.alpha <= 0 || this.lifespan <= 0;
  }
}