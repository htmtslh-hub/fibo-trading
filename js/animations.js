(function() {
  // === SCROLL REVEAL ===
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function(el) { observer.observe(el); });
  }

  // === SCROLL PROGRESS BAR ===
  var progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  // === BACK TO TOP BUTTON ===
  var backToTop = document.querySelector('.back-to-top');

  function updateProgress() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';

    // Back to top visibility
    if (backToTop) {
      if (scrollTop > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // === ANIMATED COUNTERS ===
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function(el) { counterObserver.observe(el); });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var duration = 1800;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      // Quintic ease-out for smoother finish
      var eased = 1 - Math.pow(1 - progress, 5);
      var current = Math.floor(eased * target);
      el.textContent = prefix + current.toLocaleString('vi-VN') + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // === MOUSE-FOLLOW GLOW (hero only, desktop) ===
  var isDesktop = window.matchMedia('(min-width: 769px)').matches;
  if (isDesktop) {
    var hero = document.querySelector('.hero');
    if (hero) {
      var glow = document.createElement('div');
      glow.className = 'hero-glow';
      hero.style.position = 'relative';
      hero.appendChild(glow);

      hero.addEventListener('mousemove', function(e) {
        var rect = hero.getBoundingClientRect();
        glow.style.left = (e.clientX - rect.left) + 'px';
        glow.style.top = (e.clientY - rect.top) + 'px';
        glow.style.opacity = '1';
      });
      hero.addEventListener('mouseleave', function() {
        glow.style.opacity = '0';
      });
    }
  }

  // === PARALLAX (hero background, desktop only) ===
  if (isDesktop) {
    var heroSection = document.querySelector('.hero');
    if (heroSection) {
      window.addEventListener('scroll', function() {
        var scrolled = window.pageYOffset;
        var rate = scrolled * 0.3;
        heroSection.style.backgroundPositionY = rate + 'px';
        var featuredImg = heroSection.querySelector('.featured-img');
        if (featuredImg) {
          featuredImg.style.transform = 'translateY(' + (scrolled * 0.08) + 'px)';
        }
      }, { passive: true });
    }
  }

  // === NAVBAR SHRINK ON SCROLL (class-based) ===
  var nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 80) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }
    }, { passive: true });
  }

  // === TOAST NOTIFICATION ===
  window.showToast = function(message, duration) {
    duration = duration || 3000;
    var existing = document.querySelector('.toast');
    if (!existing) {
      existing = document.createElement('div');
      existing.className = 'toast';
      existing.innerHTML = '<div class="toast-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0B0B14" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div><span class="toast-text"></span>';
      document.body.appendChild(existing);
    }
    existing.querySelector('.toast-text').textContent = message;
    existing.classList.add('show');

    clearTimeout(existing._timeout);
    existing._timeout = setTimeout(function() {
      existing.classList.remove('show');
    }, duration);
  };
})();
