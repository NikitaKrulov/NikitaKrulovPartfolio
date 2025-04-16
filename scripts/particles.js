const particlesContainer = document.getElementById('particles');
    const canvas = document.getElementById('connectionCanvas');
    const ctx = canvas.getContext('2d');
    const particles = [];
    let mouseX = 0;
    let mouseY = 0;

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

      particle.style.left = `${Math.random() * window.innerWidth}px`;
      particle.style.top = `${Math.random() * window.innerHeight}px`;

      const speedX = (Math.random() - 0.5) * 2;
      const speedY = (Math.random() - 0.5) * 2;
      particles.push({ element: particle, speedX, speedY, size });

      particlesContainer.appendChild(particle);

      particle.addEventListener('click', () => {
        particle.style.opacity = '0';
        setTimeout(() => {
          particlesContainer.removeChild(particle);
          particles.splice(particles.indexOf(particle), 1);
        }, 300);
      });
    }


    function drawConnections() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      

      if (document.body.classList.contains('dark-mode')) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'; 
      } else {
        ctx.strokeStyle = 'rgba(54, 54, 54, 0.21)'; 
      }
      
      ctx.lineWidth = 1;

      const maxDistance = 100; 


      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        const x1 = parseFloat(p1.element.style.left) + p1.size / 2;
        const y1 = parseFloat(p1.element.style.top) + p1.size / 2;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const x2 = parseFloat(p2.element.style.left) + p2.size / 2;
          const y2 = parseFloat(p2.element.style.top) + p2.size / 2;

          const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }


        const mouseDistance = Math.sqrt((mouseX - x1) ** 2 + (mouseY - y1) ** 2);
        if (mouseDistance < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }
      }
    }


    function animateParticles() {
      particles.forEach(p => {
        let x = parseFloat(p.element.style.left);
        let y = parseFloat(p.element.style.top);

        const dx = mouseX - x;
        const dy = mouseY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = 50;

        if (distance < minDistance) {
          const angle = Math.atan2(dy, dx);
          p.speedX -= Math.cos(angle) * 0.1;
          p.speedY -= Math.sin(angle) * 0.1;
        }

        x += p.speedX;
        y += p.speedY;

        if (x <= 0 || x >= window.innerWidth - p.size) {
          p.speedX *= -1;
        }
        if (y <= 0 || y >= window.innerHeight - p.size) {
          p.speedY *= -1;
        }

        p.element.style.left = `${x}px`;
        p.element.style.top = `${y}px`;
      });

      drawConnections();
      requestAnimationFrame(animateParticles);
    }


    for (let i = 0; i < 100; i++) {
      createParticle();
    }

  
    animateParticles();

    
    setInterval(createParticle, 2000);

    
    window.addEventListener('resize', () => {
      particles.forEach(p => {
        if (parseFloat(p.element.style.left) > window.innerWidth) {
          p.element.style.left = `${window.innerWidth - p.size}px`;
        }
        if (parseFloat(p.element.style.top) > window.innerHeight) {
          p.element.style.top = `${window.innerHeight - p.size}px`;
        }
      });
    });