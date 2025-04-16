const preloader = document.getElementById('preloader');
const nLetter = document.getElementById('n-letter');
const kLetter = document.getElementById('k-letter');

setTimeout(() => {
    preloader.style.transform = 'scale(10)';
    preloader.style.opacity = '0';
    document.querySelector('.content')?.classList.add('visible');
}, 1000);

setTimeout(() => {
    preloader.style.display = 'none';
}, 2000);
setTimeout(() => {
const particlesContainer = document.getElementById('particles');
const canvas = document.getElementById('connectionCanvas');
const ctx = canvas.getContext('2d');

// Функция для проверки, является ли устройство сенсорным или мобильным
function isTouchDevice() {
    return ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0) ||
        (window.innerWidth <= 768);
}

// Функция для проверки производительности устройства
function isLowPerformanceDevice() {
    // Простая эвристика: если устройство мобильное, считаем его менее производительным
    if (isTouchDevice()) return true;
    
    // Можно добавить дополнительные проверки производительности
    return false;
}

// Запускаем анимацию частиц только если устройство не сенсорное и имеет достаточную производительность
if (!isTouchDevice() && !isLowPerformanceDevice()) {
    // Настройки для оптимизации производительности и эстетики
    const config = {
        particleCount: 100, // Сохраняем количество частиц
        connectionDistance: 100,
        connectionOpacity: {
            dark: 0.3,
            light: 0.21
        },
        mouseSensitivity: 0.08,
        particleSpeed: 0.6, // Снижаем скорость для большей плавности
        lineWidth: 0.8, // Более тонкие линии для лучшего вида
        connectionUpdateFrequency: 2, // Обновляем соединения каждые N кадров
        smoothingFactor: 0.995 // Фактор затухания для плавного движения
    };
    
    const particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let frameCount = 0;

    // Настройка Canvas
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Отслеживание позиции мыши
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Создание частицы
    function createParticle() {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      const size = Math.random() * 5 + 5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // Добавляем случайное начальное положение
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

      // Используем более плавную скорость
      const angle = Math.random() * Math.PI * 2;
      const speed = config.particleSpeed;
      const speedX = Math.cos(angle) * speed * (0.5 + Math.random() * 0.5);
      const speedY = Math.sin(angle) * speed * (0.5 + Math.random() * 0.5);
      
      // Храним позиции как числовые переменные для оптимизации
      particles.push({ 
          element: particle, 
          speedX, 
          speedY, 
          size, 
          x, 
          y,
          // Добавляем параметры для более плавной анимации
          targetX: x,
          targetY: y,
          // Храним предыдущие значения для плавной интерполяции
          prevX: x,
          prevY: y
      });

      particlesContainer.appendChild(particle);

      // Обработчик клика на частице
      particle.addEventListener('click', () => {
        particle.style.opacity = '0';
        setTimeout(() => {
          particlesContainer.removeChild(particle);
          const index = particles.findIndex(p => p.element === particle);
          if (index !== -1) {
            particles.splice(index, 1);
            // Создаем новую частицу для поддержания количества
            createParticle();
          }
        }, 300);
      });
    }

    function drawConnections() {
      // Оптимизация: обновляем соединения только каждые N кадров
      frameCount++;
      if (frameCount % config.connectionUpdateFrequency !== 0) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Используем соответствующий цвет в зависимости от темы
      if (document.body.classList.contains('dark-mode')) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${config.connectionOpacity.dark})`;
      } else {
        ctx.strokeStyle = `rgba(54, 54, 54, ${config.connectionOpacity.light})`;
      }
      
      ctx.lineWidth = config.lineWidth;
      
      const maxDistanceSquared = config.connectionDistance * config.connectionDistance;

      // Используем простую пространственную оптимизацию
      const gridSize = config.connectionDistance;
      const grid = {};
      
      // Размещаем частицы в сетке для сокращения проверок соединений
      particles.forEach((p, i) => {
        const gridX = Math.floor(p.x / gridSize);
        const gridY = Math.floor(p.y / gridSize);
        const gridKey = `${gridX},${gridY}`;
        
        if (!grid[gridKey]) {
          grid[gridKey] = [];
        }
        grid[gridKey].push(i);
      });
      
      // Проверяем соединения только с ближайшими частицами
      particles.forEach((p1, i) => {
        const x1 = p1.x + p1.size / 2;
        const y1 = p1.y + p1.size / 2;
        const gridX = Math.floor(p1.x / gridSize);
        const gridY = Math.floor(p1.y / gridSize);
        
        // Проверяем только соседние ячейки сетки
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const neighborKey = `${gridX + dx},${gridY + dy}`;
            if (grid[neighborKey]) {
              grid[neighborKey].forEach(j => {
                if (j > i) { // Избегаем дублирования соединений
                  const p2 = particles[j];
                  const x2 = p2.x + p2.size / 2;
                  const y2 = p2.y + p2.size / 2;
                  
                  const dx = x2 - x1;
                  const dy = y2 - y1;
                  const distanceSquared = dx * dx + dy * dy;
                  
                  if (distanceSquared < maxDistanceSquared) {
                    // Постепенная прозрачность в зависимости от расстояния
                    const opacity = 1 - Math.sqrt(distanceSquared) / config.connectionDistance;
                    if (document.body.classList.contains('dark-mode')) {
                      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * config.connectionOpacity.dark})`;
                    } else {
                      ctx.strokeStyle = `rgba(54, 54, 54, ${opacity * config.connectionOpacity.light})`;
                    }
                    
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                  }
                }
              });
            }
          }
        }
        
        // Соединение с курсором
        const dxMouse = mouseX - x1;
        const dyMouse = mouseY - y1;
        const mouseDistanceSquared = dxMouse * dxMouse + dyMouse * dyMouse;
        
        if (mouseDistanceSquared < maxDistanceSquared) {
          const opacity = 1 - Math.sqrt(mouseDistanceSquared) / config.connectionDistance;
          if (document.body.classList.contains('dark-mode')) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * config.connectionOpacity.dark * 1.2})`;
          } else {
            ctx.strokeStyle = `rgba(54, 54, 54, ${opacity * config.connectionOpacity.light * 1.2})`;
          }
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }
      });
    }

    function animateParticles() {
      particles.forEach(p => {
        // Сохраняем предыдущие значения для интерполяции
        p.prevX = p.x;
        p.prevY = p.y;
        
        // Отталкивание от курсора мыши
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = 50;

        if (distance < minDistance) {
          const angle = Math.atan2(dy, dx);
          const force = (1 - distance / minDistance) * config.mouseSensitivity;
          p.speedX -= Math.cos(angle) * force;
          p.speedY -= Math.sin(angle) * force;
        }

        // Обновляем скорости и позиции
        p.x += p.speedX;
        p.y += p.speedY;

        // Отскок от границ экрана
        if (p.x <= 0 || p.x >= window.innerWidth - p.size) {
          p.speedX *= -1;
          p.x = p.x <= 0 ? 0 : window.innerWidth - p.size;
        }
        if (p.y <= 0 || p.y >= window.innerHeight - p.size) {
          p.speedY *= -1;
          p.y = p.y <= 0 ? 0 : window.innerHeight - p.size;
        }

        // Применяем затухание для более плавного движения
        p.speedX *= config.smoothingFactor;
        p.speedY *= config.smoothingFactor;

        // Применяем интерполяцию для плавности движения
        const interp = 0.85; // Коэффициент плавности
        p.targetX = p.x;
        p.targetY = p.y;
        const renderX = p.prevX + (p.targetX - p.prevX) * interp;
        const renderY = p.prevY + (p.targetY - p.prevY) * interp;

        // Обновляем DOM только при значительных изменениях (оптимизация)
        if (Math.abs(parseFloat(p.element.style.left) - renderX) > 0.1 ||
            Math.abs(parseFloat(p.element.style.top) - renderY) > 0.1) {
          p.element.style.left = `${renderX}px`;
          p.element.style.top = `${renderY}px`;
        }
      });

      drawConnections();
      requestAnimationFrame(animateParticles);
    }

    // Создаем начальные частицы
    for (let i = 0; i < config.particleCount; i++) {
      createParticle();
    }

    // Запускаем анимацию
    requestAnimationFrame(animateParticles);
    
    // Добавление новых частиц только для замены удаленных при клике
    setInterval(() => {
      if (particles.length < config.particleCount) {
        createParticle();
      }
    }, 2000);

    // Обработка изменения размера окна
    window.addEventListener('resize', () => {
      particles.forEach(p => {
        if (p.x > window.innerWidth - p.size) {
          p.x = window.innerWidth - p.size;
          p.element.style.left = `${p.x}px`;
        }
        if (p.y > window.innerHeight - p.size) {
          p.y = window.innerHeight - p.size;
          p.element.style.top = `${p.y}px`;
        }
      });
    });
} else {
    // Скрываем элементы canvas и частиц для слабых/сенсорных устройств
    if (particlesContainer) particlesContainer.style.display = 'none';
    if (canvas) canvas.style.display = 'none';
}}, 1000);