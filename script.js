// Dropdown Contato
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdownMenu = document.querySelector('.dropdown-menu');

if (dropdownToggle && dropdownMenu) {
  dropdownToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita conflito com clique fora
    const isVisible = dropdownMenu.style.display === 'flex';
    dropdownMenu.style.display = isVisible ? 'none' : 'flex';
  });

  window.addEventListener('click', (e) => {
    if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.style.display = 'none';
    }
  });
}

// Botão "Voltar ao topo"
const btnTopo = document.getElementById('btn-topo');
if (btnTopo) {
  window.addEventListener('scroll', () => {
    btnTopo.style.display = window.scrollY > 300 ? 'flex' : 'none';
  });

  btnTopo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Efeito de digitação
const typingEffect = document.querySelector('.typing-effect');

function restartTypingEffect() {
  if (typingEffect) {
    typingEffect.classList.add('restart'); // Adiciona classe temporária
    void typingEffect.offsetWidth; // força reflow
    typingEffect.classList.remove('restart');
  }
}

window.addEventListener('load', restartTypingEffect);

// Alternar tema claro/escuro
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    themeToggle.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
    restartTypingEffect(); // reinicia a digitação ao alternar tema
  });
}

// Menu hambúrguer para mobile
const menuToggle = document.getElementById('hamburger'); // usa o ID correto
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  window.addEventListener('click', (e) => {
    const isClickInsideMenu = navLinks.contains(e.target);
    const isClickOnToggle = menuToggle.contains(e.target);

    if (!isClickInsideMenu && !isClickOnToggle) {
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}


// Fundo animado: estrelas no escuro, sol no claro
const backgroundCanvas = document.getElementById('background-canvas');
if (backgroundCanvas) {
  const bgCtx = backgroundCanvas.getContext('2d');

  let bgStars = [];
  let animationId;

  function resizeBackgroundCanvas() {
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;
  }
  resizeBackgroundCanvas();
  window.addEventListener('resize', resizeBackgroundCanvas);

  function createBackgroundStars(count) {
    bgStars = [];
    for (let i = 0; i < count; i++) {
      bgStars.push({
        x: Math.random() * backgroundCanvas.width,
        y: Math.random() * backgroundCanvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.3 + 0.1
      });
    }
  }

  function animateBackgroundStars() {
    bgCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

    for (let star of bgStars) {
      star.y += star.speed;
      if (star.y > backgroundCanvas.height) star.y = 0;

      bgCtx.beginPath();
      bgCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      bgCtx.fillStyle = '#ffffff';
      bgCtx.fill();
    }

    animationId = requestAnimationFrame(animateBackgroundStars);
  }

  function drawSunBackground() {
    bgCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    const gradient = bgCtx.createRadialGradient(
      backgroundCanvas.width / 2,
      backgroundCanvas.height / 2,
      50,
      backgroundCanvas.width / 2,
      backgroundCanvas.height / 2,
      backgroundCanvas.width
    );
    gradient.addColorStop(0, "#c9e0e0ff"); // amarelo claro
    gradient.addColorStop(1, "#85aec7ff"); // azul céu
    bgCtx.fillStyle = gradient;
    bgCtx.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
  }

  function switchCanvasTheme(isLight) {
    cancelAnimationFrame(animationId);
    if (isLight) {
      drawSunBackground();
    } else {
      createBackgroundStars(200);
      animateBackgroundStars();
    }
  }

  // Detecta troca de tema automaticamente
  const themeObserver = new MutationObserver(() => {
    const isLight = document.body.classList.contains("light");
    switchCanvasTheme(isLight);
  });
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // Inicia com o tema atual
  switchCanvasTheme(document.body.classList.contains("light"));
}


(() => {
  const canvas = document.getElementById('snake');
  const ctx = canvas.getContext('2d');

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  const SCALE = 20; // tamanho do quadrado (segmento)
  const ROWS = WIDTH / SCALE;  // 20
  const COLS = HEIGHT / SCALE; // 20

  let snake = [];
  let direction = { x: 1, y: 0 }; // começa indo para a direita
  let food = null;
  let gameInterval = null;
  let running = false;

  function initGame() {
    snake = [
      { x: 5, y: 10 },
      { x: 4, y: 10 },
      { x: 3, y: 10 },
    ];
    direction = { x: 1, y: 0 };
    placeFood();
    running = true;
  }

  function placeFood() {
    while (true) {
      const x = Math.floor(Math.random() * ROWS);
      const y = Math.floor(Math.random() * COLS);

      // Não colocar comida na cobrinha
      if (!snake.some(seg => seg.x === x && seg.y === y)) {
        food = { x, y };
        break;
      }
    }
  }

  // Impede que as teclas de seta façam scroll
        window.addEventListener("keydown", function (e) {
         const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "];
            if (keys.includes(e.key)) {
            e.preventDefault();
  }
}, { passive: false });


  function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
  }

  function clearCanvas() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT); // Apenas limpa sem pintar fundo
    }


  function draw() {
    clearCanvas();

    // Desenha comida (maçã)
    drawSquare(food.x, food.y, 'red');

    // Desenha cobrinha
    snake.forEach((seg, idx) => {
      drawSquare(seg.x, seg.y, idx === 0 ? 'lime' : 'green');
    });

    // Desenha bordas do canvas (opcional)
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, WIDTH, HEIGHT);

    // Pontuação no topo
    ctx.fillStyle = 'white';
    ctx.font = '20px monospace';
    ctx.fillText(`Pontuação: ${snake.length - 3}`, 10, 25);
  }

  function moveSnake() {
    const head = snake[0];
    const newHead = { x: head.x + direction.x, y: head.y + direction.y };

    // Verifica colisão com paredes
    if (
      newHead.x < 0 || newHead.x >= ROWS ||
      newHead.y < 0 || newHead.y >= COLS
    ) {
      return gameOver();
    }

    // Verifica colisão com o corpo
    if (snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
      return gameOver();
    }

    snake.unshift(newHead);

    // Comeu a comida?
    if (newHead.x === food.x && newHead.y === food.y) {
      placeFood(); // gera comida nova
    } else {
      snake.pop(); // remove a cauda
    }
  }

    function iniciarJogo() {
    document.body.classList.add('no-scroll');
    // lógica do jogo
    }

    function finalizarJogo() {
    document.body.classList.remove('no-scroll');
    // lógica de fim de jogo
    }

  function gameOver() {
    clearInterval(gameInterval);
    running = false;

    ctx.fillStyle = 'white';
    ctx.font = '40px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('🔥 FIM DE JOGO!', WIDTH / 2, HEIGHT / 2 - 20);
    ctx.font = '20px monospace';
    ctx.fillText(`Pontuação final: ${snake.length - 3}`, WIDTH / 2, HEIGHT / 2 + 20);
    ctx.fillText('Pressione ENTER para reiniciar', WIDTH / 2, HEIGHT / 2 + 60);
  }

  function gameLoop() {
    moveSnake();
    draw();
  }

  function keyHandler(e) {
    if (!running) {
      if (e.key === 'Enter') {
        startGame();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
        if (direction.y !== 1) direction = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        if (direction.y !== -1) direction = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        if (direction.x !== 1) direction = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        if (direction.x !== -1) direction = { x: 1, y: 0 };
        break;
    }
  }

  function startGame() {
    if (running) return;
    initGame();
    draw();
    gameInterval = setInterval(gameLoop, 150);
    running = true;
  }

  window.addEventListener('keydown', keyHandler);

  // Mensagem inicial
  clearCanvas();
  ctx.fillStyle = 'pink';
  ctx.font = '31px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Jogo da cobrinha', WIDTH / 2, HEIGHT / 2 - 100);
  ctx.fillText('🐍', WIDTH / 2, HEIGHT / 2 - 6);
  ctx.font = '15px monospace';
  ctx.fillText('Use as setas para mover', WIDTH / 2, HEIGHT / 2 + 70);
  ctx.fillText('Pressione ENTER para iniciar', WIDTH / 2, HEIGHT / 2 + 95);

  window.startSnakeGame = startGame;
})();





