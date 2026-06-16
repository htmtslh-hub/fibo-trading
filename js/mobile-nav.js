(function() {
  var toggle = document.getElementById('mobileToggle') || document.querySelector('.nav-mobile-toggle');
  var overlay = document.querySelector('.mobile-nav-overlay');
  var panel = document.querySelector('.mobile-nav-panel');
  var closeBtn = document.querySelector('.mobile-nav-close');

  if (!toggle || !overlay || !panel) return;

  function openMenu() {
    overlay.classList.add('active');
    panel.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeMenu() {
    overlay.classList.remove('active');
    panel.classList.remove('active');
    document.body.style.overflow = '';
    toggle.focus();
  }

  toggle.addEventListener('click', openMenu);
  overlay.addEventListener('click', closeMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeMenu();
    }
  });

  // Close on link click
  var links = panel.querySelectorAll('a');
  links.forEach(function(link) {
    link.addEventListener('click', function() {
      setTimeout(closeMenu, 150);
    });
  });
})();
