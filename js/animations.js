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

  function updateProgress() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

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
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 4);
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

  // === NAVBAR SHRINK ON SCROLL ===
  var nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 80) {
        nav.style.height = '60px';
        nav.style.boxShadow = '0 4px 30px rgba(0,0,0,.3)';
      } else {
        nav.style.height = '';
        nav.style.boxShadow = '';
      }
    }, { passive: true });
  }
})();
