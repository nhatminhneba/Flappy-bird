const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

// T?i hình ?nh
const birdImg = new Image();
birdImg.src = "bird.png"; // Ðu?ng d?n d?n hình ?nh chim

const backgroundImg = new Image();
backgroundImg.src = "background.png"; // Ðu?ng d?n d?n hình ?nh n?n

const pipeWidth = 30;
const pipeGap = 100;
let frameCount = 0;

const bird = {
  x: 50,
  y: 150,
  width: 34, // chi?u r?ng hình ?nh chim (tùy thu?c vào kích thu?c c?a hình ?nh)
  height: 24, // chi?u cao hình ?nh chim
  gravity: 0.6,
  lift: -10,
  velocity: 0,
  draw: function() {
    context.drawImage(birdImg, this.x, this.y, this.width, this.height); // V? chim b?ng hình ?nh
  },
  update: function() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    if (this.y + this.height > canvas.height) {
      this.y = canvas.height - this.height;
      this.velocity = 0;
    }
    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  },
  fly: function() {
    this.velocity = this.lift;
  }
};

const pipes = [];

function drawPipes() {
  pipes.forEach(pipe => {
    context.fillStyle = "green";
    context.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    context.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
  });
}

function updatePipes() {
  if (frameCount % 90 === 0) {
    const topPipeHeight = Math.random() * (canvas.height - pipeGap - 20);
    const bottomPipeHeight = canvas.height - pipeGap - topPipeHeight;
    pipes.push({
      x: canvas.width,
      top: topPipeHeight,
      bottom: bottomPipeHeight
    });
  }

  pipes.forEach(pipe => {
    pipe.x -= 2;

    if (pipe.x + pipeWidth < 0) {
      pipes.shift();
    }

    if (bird.x < pipe.x + pipeWidth && bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)) {
      resetGame();
    }
  });
}

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes.length = 0;
  frameCount = 0;
}

function gameLoop() {
  // V? hình n?n tru?c khi v? các d?i tu?ng khác
  context.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

  bird.update();
  bird.draw();

  updatePipes();
  drawPipes();

  frameCount++;
  requestAnimationFrame(gameLoop);
}

canvas.addEventListener("click", () => {
  bird.fly();
});

gameLoop();
