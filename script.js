document.getElementById("year").textContent = new Date().getFullYear();

const roles = [
  "Theatre Tech Director",
  "Guitarist / Drummer",
  "Music Producer",
  "Aspiring Biomedical & Aerospace Engineer",
  "Filmmaker",
];

const typedEl = document.getElementById("typed");
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function tick() {
  const current = roles[roleIndex];

  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(tick, 1400);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(tick, deleting ? 35 : 60);
}

tick();

document.querySelectorAll(".story-toggle").forEach((button) => {
  const content = button.nextElementSibling;
  button.addEventListener("click", () => {
    const isOpen = content.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

(() => {
  const canvas = document.getElementById("snake-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const cell = 15;
  const cols = canvas.width / cell;
  const rows = canvas.height / cell;
  const scoreEl = document.getElementById("snake-score");
  const bestEl = document.getElementById("snake-best");
  const startBtn = document.getElementById("snake-start");

  let snake = [];
  let dir = { x: 1, y: 0 };
  let nextDir = dir;
  let food = { x: 0, y: 0 };
  let score = 0;
  let best = Number(localStorage.getItem("snake-best") || 0);
  let loopId = null;
  let running = false;

  bestEl.textContent = best;

  function placeFood() {
    let pos;
    do {
      pos = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows),
      };
    } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
    food = pos;
  }

  function resetState() {
    snake = [
      { x: 8, y: 9 },
      { x: 7, y: 9 },
      { x: 6, y: 9 },
    ];
    dir = { x: 1, y: 0 };
    nextDir = dir;
    score = 0;
    scoreEl.textContent = score;
    placeFood();
  }

  function draw() {
    ctx.fillStyle = "#10151f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffbd2e";
    ctx.fillRect(food.x * cell + 2, food.y * cell + 2, cell - 4, cell - 4);

    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? "#00ff9d" : "rgba(0, 255, 157, 0.6)";
      ctx.fillRect(seg.x * cell + 1, seg.y * cell + 1, cell - 2, cell - 2);
    });
  }

  function showMessage(text) {
    ctx.fillStyle = "rgba(10, 14, 20, 0.85)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f0f3f6";
    ctx.font = "16px monospace";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  }

  function gameOver() {
    running = false;
    clearInterval(loopId);
    if (score > best) {
      best = score;
      localStorage.setItem("snake-best", String(best));
      bestEl.textContent = best;
    }
    showMessage("Game Over — press Start");
    startBtn.textContent = "Restart";
  }

  function tick() {
    dir = nextDir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    const hitsWall = head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows;
    const hitsSelf = snake.some((s) => s.x === head.x && s.y === head.y);

    if (hitsWall || hitsSelf) {
      gameOver();
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score += 10;
      scoreEl.textContent = score;
      placeFood();
    } else {
      snake.pop();
    }

    draw();
  }

  function startGame() {
    resetState();
    draw();
    running = true;
    startBtn.textContent = "Restart";
    clearInterval(loopId);
    loopId = setInterval(tick, 120);
  }

  function setDirection(x, y) {
    if (!running) return;
    if (x === -dir.x && y === -dir.y) return;
    nextDir = { x, y };
  }

  const keyMap = {
    ArrowUp: [0, -1],
    w: [0, -1],
    ArrowDown: [0, 1],
    s: [0, 1],
    ArrowLeft: [-1, 0],
    a: [-1, 0],
    ArrowRight: [1, 0],
    d: [1, 0],
  };

  document.addEventListener("keydown", (e) => {
    if (!running) return;
    const mapped = keyMap[e.key.length === 1 ? e.key.toLowerCase() : e.key];
    if (mapped) {
      e.preventDefault();
      setDirection(mapped[0], mapped[1]);
    }
  });

  document.querySelectorAll(".game-btn").forEach((btn) => {
    const dirMap = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
    btn.addEventListener("click", () => {
      const [x, y] = dirMap[btn.dataset.dir];
      setDirection(x, y);
    });
  });

  startBtn.addEventListener("click", startGame);

  resetState();
  draw();
  showMessage("Press Start to play");

  const toggleBtn = document.getElementById("game-toggle");
  const panel = document.getElementById("game-panel");
  const closeBtn = document.getElementById("game-close");

  function closePanel() {
    panel.hidden = true;
    toggleBtn.setAttribute("aria-expanded", "false");
    running = false;
    clearInterval(loopId);
  }

  function openPanel() {
    panel.hidden = false;
    toggleBtn.setAttribute("aria-expanded", "true");
  }

  toggleBtn.addEventListener("click", () => {
    if (panel.hidden) {
      openPanel();
    } else {
      closePanel();
    }
  });

  closeBtn.addEventListener("click", closePanel);
})();
