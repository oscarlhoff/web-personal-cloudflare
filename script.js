document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. FLOATING PILL NAVBAR SCROLL EFFECT & ACTIVE SECTION
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinksList = document.querySelectorAll('.nav-item');

  const onScroll = () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    const scrollY = window.pageYOffset;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-item[href*="${sectionId}"]`);

      if (activeLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          activeLink.classList.add('active');
        } else {
          activeLink.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ==========================================================================
  // 2. MOBILE MENU TOGGLE
  // ==========================================================================
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    document.querySelectorAll('.nav-item').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  }

  // ==========================================================================
  // 3. 3D ORBIT MOUSE PARALLAX INTERACTION
  // ==========================================================================
  const heroSection = document.getElementById('hero');
  const orbitScene = document.querySelector('.orbit-scene');

  if (heroSection && orbitScene && window.matchMedia('(pointer: fine)').matches) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Subtle tilt: max 12 deg
      targetX = -(y / (rect.height / 2)) * 12;
      targetY = (x / (rect.width / 2)) * 12;
    });

    heroSection.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });

    const animateTilt = () => {
      // Lerp for ultra-smooth fluid feel
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      orbitScene.style.transform = `perspective(1000px) rotateX(${currentX}deg) rotateY(${currentY}deg)`;
      requestAnimationFrame(animateTilt);
    };

    animateTilt();
  }

  // ==========================================================================
  // 4. TYPEWRITER EFFECT
  // ==========================================================================
  const typewriterElem = document.getElementById('typewriter');
  const words = [
    'Desarrollador Full Stack en proceso',
    'Explorando el mundo de la IA',
    'Python · SQL · Git · Linux',
    'Moldeando el entorno virtual'
  ];
  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typingDelay = 100;
  const deletingDelay = 50;
  const pauseDelay = 2200;

  function type() {
    if (!typewriterElem) return;
    const currentWord = words[wordIdx];

    if (isDeleting) {
      typewriterElem.textContent = currentWord.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typewriterElem.textContent = currentWord.substring(0, charIdx + 1);
      charIdx++;
    }

    let currentSpeed = isDeleting ? deletingDelay : typingDelay;

    if (!isDeleting && charIdx === currentWord.length) {
      currentSpeed = pauseDelay;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      currentSpeed = 350;
    }

    setTimeout(type, currentSpeed);
  }

  type();

  // ==========================================================================
  // 5. ANIMATED METRICS COUNTER (BENTO GRID)
  // ==========================================================================
  const metricSection = document.querySelector('.bento-metrics');
  const metricNumbers = document.querySelectorAll('.metric-number');
  let metricsStarted = false;

  const countUp = () => {
    metricNumbers.forEach((counter) => {
      const target = +counter.getAttribute('data-target');
      const duration = 1600;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(easeOut * target);

        counter.textContent = currentCount;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  if ('IntersectionObserver' in window && metricSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !metricsStarted) {
          metricsStarted = true;
          countUp();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(metricSection);
  } else {
    countUp();
  }

  // ==========================================================================
  // 6. SCROLL REVEAL OBSERVER
  // ==========================================================================
  const revealElements = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // ==========================================================================
  // 7. COPY EMAIL TO CLIPBOARD
  // ==========================================================================
  const btnCopyEmail = document.getElementById('btnCopyEmail');
  const emailText = document.getElementById('emailText');
  const copyFeedback = document.getElementById('copyFeedback');
  const copyIcon = document.getElementById('copyIcon');

  if (btnCopyEmail && emailText) {
    btnCopyEmail.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(emailText.textContent.trim());
        if (copyFeedback && copyIcon) {
          copyFeedback.textContent = '¡Copiado!';
          copyIcon.className = 'ph ph-check';
          setTimeout(() => {
            copyFeedback.textContent = 'Copiar';
            copyIcon.className = 'ph ph-copy';
          }, 2000);
        }
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = emailText.textContent.trim();
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        if (copyFeedback) copyFeedback.textContent = '¡Copiado!';
        setTimeout(() => {
          if (copyFeedback) copyFeedback.textContent = 'Copiar';
        }, 2000);
      }
    });
  }

  // ==========================================================================
  // 8. GENERATE SUBTLE AMBIENT STARS
  // ==========================================================================
  const starsBg = document.getElementById('starsBg');
  if (starsBg) {
    const starCount = 35;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      const size = Math.random() * 2 + 1;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const opacity = Math.random() * 0.7 + 0.2;
      const delay = Math.random() * 5;

      star.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: #ffffff;
        border-radius: 50%;
        top: ${posY}%;
        left: ${posX}%;
        opacity: ${opacity};
        filter: drop-shadow(0 0 4px #818cf8);
        animation: twinkleStar ${3 + Math.random() * 4}s ease-in-out infinite alternate;
        animation-delay: ${delay}s;
      `;
      fragment.appendChild(star);
    }
    starsBg.appendChild(fragment);
  }
});

// Dynamic Twinkle Keyframe
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes twinkleStar {
    0% { opacity: 0.15; transform: scale(0.8); }
    100% { opacity: 0.85; transform: scale(1.2); }
  }
`;
document.head.appendChild(styleSheet);
