function rotate(velocity, angle) {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
  };
  return rotatedVelocities;
}

function resolveCollision(ball, otherBall) {
  const xVelocityDiff = ball.velocity.x - otherBall.velocity.x;
  const yVelocityDiff = ball.velocity.y - otherBall.velocity.y;

  const xDist = otherBall.x - ball.x;
  const yDist = otherBall.y - ball.y;

  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    const angle = -Math.atan2(yDist, xDist);

    const m1 = ball.mass;
    const m2 = otherBall.mass;

    const u1 = rotate(ball.velocity, angle);
    const u2 = rotate(otherBall.velocity, angle);

    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y,
    };
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y,
    };

    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    ball.velocity.x = vFinal1.x;
    ball.velocity.y = vFinal1.y;

    otherBall.velocity.x = vFinal2.x;
    otherBall.velocity.y = vFinal2.y;
  }
}

function distance(x1, y1, x2, y2) {
  const xDiff = x1 - x2;
  const yDiff = y1 - y2;
  return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
}

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const colors = ['#EC4E20', '#FFCB47', '#F7A1C4', '#54C6EB', '#7067CF'];

let gravity = 0.1;
let friction = 0.9;

class Ball {
  x;
  y;
  velocity = {
    x: randomIntFromRange(-3, 3),
    y: randomIntFromRange(-3, 3),
  };
  mass = 1;
  dx;
  dy;
  radius;
  startAngle = 0;
  endangle = 2 * Math.PI;
  color;
  constructor(x, y, dx, dy, radius, color = '#2185C5') {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, this.startAngle, this.endangle);
    c.fillStyle = this.color;
    c.fill();
    c.stroke();
    c.closePath();
  }

  update(balls) {
    this.draw();

    for (let i = 0; i < balls.length; i++) {
      if (this === balls[i]) continue;
      if (
        distance(this.x, this.y, balls[i].x, balls[i].y) - this.radius * 2 <
        0
      ) {
        resolveCollision(this, balls[i]);
      }
    }

    if (this.y + this.radius >= canvas.height || this.y - this.radius <= 0) {
      this.velocity.y = -this.velocity.y;
    } else {
    }
    if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
      this.velocity.x = -this.velocity.x;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function createBalls(number) {
  const balls = [];
  for (let i = 0; i < number; i++) {
    const radius = randomIntFromRange(10, 30);
    let x = randomIntFromRange(radius, canvas.width - radius);
    let y = randomIntFromRange(radius, canvas.height - radius);
    const dx = randomIntFromRange(-2, 2);
    const dy = randomIntFromRange(-2, 2);
    const color = randomColor(colors);

    if (i !== 0) {
      for (let j = 0; j < balls.length; j++) {
        if (distance(x, y, balls[j].x, balls[j].y) - radius * 2 < 0) {
          x = randomIntFromRange(radius, canvas.width - radius);
          y = randomIntFromRange(radius, canvas.height - radius);
          j = -1;
        }
      }
    }
    balls.push(new Ball(x, y, dx, dy, radius, color));
  }
  return balls;
}
const ballNum = 100;
let balls = createBalls(ballNum);

function reset() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  balls = createBalls(ballNum);
}

addEventListener('click', reset);

addEventListener('resize', reset);

function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  balls.forEach((ball) => {
    ball.update(balls);
  });
  requestAnimationFrame(animate);
}

animate();
