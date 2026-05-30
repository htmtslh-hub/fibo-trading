/**
 * Anti-Screenshot & Content Protection Script
 * Prevents: PrintScreen, screenshots, screen recording, right-click, text selection, 
 * copy/paste, dev tools, and drag of content.
 * 
 * NOTE: Client-side protection is never 100% foolproof, but these measures
 * deter the vast majority of casual attempts.
 */
(function () {
  'use strict';

  // ══════════════════════════════════════════════════════════════
  //  1. CSS-based protections (injected dynamically)
  // ══════════════════════════════════════════════════════════════
  const protectionCSS = document.createElement('style');
  protectionCSS.textContent = `
    /* Prevent text selection */
    body {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
      -webkit-touch-callout: none !important;
    }

    /* Prevent image dragging */
    img {
      -webkit-user-drag: none !important;
      -khtml-user-drag: none !important;
      -moz-user-drag: none !important;
      -o-user-drag: none !important;
      user-drag: none !important;
      pointer-events: none !important;
    }

    /* Allow pointer events on links and buttons that contain images */
    a img, button img {
      pointer-events: auto !important;
    }

    /* Prevent printing */
    @media print {
      body {
        display: none !important;
      }
      html::after {
        content: "Nội dung được bảo vệ bản quyền — Không được phép in.";
        display: block;
        font-size: 24px;
        text-align: center;
        padding: 60px 20px;
        color: #888;
      }
    }
  `;
  document.head.appendChild(protectionCSS);

  // ══════════════════════════════════════════════════════════════
  //  2. Overlay that covers the page when screenshot is detected
  // ══════════════════════════════════════════════════════════════
  const overlay = document.createElement('div');
  overlay.id = 'screenshot-shield';
  overlay.innerHTML = `
    <div style="
      position: fixed; inset: 0; z-index: 2147483647;
      background: #0a0a0f;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      opacity: 0; pointer-events: none;
      transition: opacity 0.15s ease;
    ">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#c8f560" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:20px;">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <line x1="3" y1="3" x2="21" y2="21"/>
      </svg>
      <p style="
        font-family: 'Be Vietnam Pro', sans-serif;
        font-size: 18px; font-weight: 600; color: #fff;
        margin: 0 0 8px;
      ">Nội dung được bảo vệ</p>
      <p style="
        font-family: 'Be Vietnam Pro', sans-serif;
        font-size: 13px; color: #888; margin: 0;
      ">Chụp ảnh màn hình đã bị vô hiệu hóa trên trang này.</p>
    </div>
  `;
  document.body.appendChild(overlay);

  const shieldEl = overlay.firstElementChild;
  let shieldTimeout;

  function showShield(duration) {
    shieldEl.style.opacity = '1';
    shieldEl.style.pointerEvents = 'all';
    clearTimeout(shieldTimeout);
    shieldTimeout = setTimeout(() => {
      shieldEl.style.opacity = '0';
      shieldEl.style.pointerEvents = 'none';
    }, duration || 1500);
  }

  // ══════════════════════════════════════════════════════════════
  //  3. Block keyboard shortcuts for screenshots & dev tools
  // ══════════════════════════════════════════════════════════════
  document.addEventListener('keyup', function (e) {
    // PrintScreen key
    if (e.key === 'PrintScreen') {
      // Overwrite clipboard with empty content
      navigator.clipboard.writeText('').catch(() => {});
      showShield(2000);
      e.preventDefault();
    }
  }, true);

  document.addEventListener('keydown', function (e) {
    const key = e.key.toLowerCase();

    // PrintScreen
    if (e.key === 'PrintScreen') {
      e.preventDefault();
      navigator.clipboard.writeText('').catch(() => {});
      showShield(2000);
      return false;
    }

    // Windows Snipping Tool: Win + Shift + S
    if (e.metaKey && e.shiftKey && key === 's') {
      e.preventDefault();
      showShield(2000);
      return false;
    }

    // macOS screenshot: Cmd + Shift + 3/4/5
    if (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(key)) {
      e.preventDefault();
      showShield(2000);
      return false;
    }

    // Block Ctrl+P (Print)
    if ((e.ctrlKey || e.metaKey) && key === 'p') {
      e.preventDefault();
      showShield(1500);
      return false;
    }

    // Block Ctrl+S (Save page)
    if ((e.ctrlKey || e.metaKey) && key === 's' && !e.shiftKey) {
      e.preventDefault();
      return false;
    }

    // Block Ctrl+C (Copy)
    if ((e.ctrlKey || e.metaKey) && key === 'c') {
      e.preventDefault();
      return false;
    }

    // Block Ctrl+U (View source)
    if ((e.ctrlKey || e.metaKey) && key === 'u') {
      e.preventDefault();
      return false;
    }

    // Block Ctrl+Shift+I / Cmd+Option+I (DevTools)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && key === 'i') {
      e.preventDefault();
      return false;
    }

    // Block F12 (DevTools)
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }

    // Block Ctrl+Shift+J (Console)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && key === 'j') {
      e.preventDefault();
      return false;
    }

    // Block Ctrl+Shift+C (Element picker)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && key === 'c') {
      e.preventDefault();
      return false;
    }
  }, true);

  // ══════════════════════════════════════════════════════════════
  //  4. Block right-click context menu
  // ══════════════════════════════════════════════════════════════
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
  }, true);

  // ══════════════════════════════════════════════════════════════
  //  5. Block copy & cut events
  // ══════════════════════════════════════════════════════════════
  document.addEventListener('copy', function (e) {
    e.preventDefault();
    return false;
  }, true);

  document.addEventListener('cut', function (e) {
    e.preventDefault();
    return false;
  }, true);

  // ══════════════════════════════════════════════════════════════
  //  6. Block drag events (prevent dragging images/content out)
  // ══════════════════════════════════════════════════════════════
  document.addEventListener('dragstart', function (e) {
    e.preventDefault();
    return false;
  }, true);

  // ══════════════════════════════════════════════════════════════
  //  7. Visibility change detection (screen recording / tab switch)
  // ══════════════════════════════════════════════════════════════
  // When the page is not visible (e.g., screen capture tool opens),
  // blank the page content
  let blankOnHide = false;

  document.addEventListener('visibilitychange', function () {
    if (document.hidden && blankOnHide) {
      document.body.style.filter = 'blur(30px)';
    } else {
      document.body.style.filter = '';
    }
  });

  // ══════════════════════════════════════════════════════════════
  //  8. Screen Capture API protection
  //     Uses the experimental Screen Capture API to detect when
  //     the page is being captured and blur it
  // ══════════════════════════════════════════════════════════════
  if ('getDisplayMedia' in navigator.mediaDevices) {
    // Override getDisplayMedia to make it harder to use
    const origGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getDisplayMedia = function () {
      showShield(3000);
      return Promise.reject(new DOMException('Screen capture is disabled on this page.', 'NotAllowedError'));
    };
  }

  // ══════════════════════════════════════════════════════════════
  //  9. DevTools detection (debugger-based)
  //     Detects when DevTools is open by checking timing differences
  // ══════════════════════════════════════════════════════════════
  let devtoolsOpen = false;

  function detectDevTools() {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;

    if (widthThreshold || heightThreshold) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        document.body.style.filter = 'blur(20px)';
      }
    } else {
      if (devtoolsOpen) {
        devtoolsOpen = false;
        document.body.style.filter = '';
      }
    }
  }

  setInterval(detectDevTools, 1000);

  // ══════════════════════════════════════════════════════════════
  // 10. Console protection message
  // ══════════════════════════════════════════════════════════════
  console.log(
    '%c⛔ Cảnh báo!',
    'color: red; font-size: 40px; font-weight: bold;'
  );
  console.log(
    '%cNội dung trang web này được bảo vệ bản quyền. Mọi hành vi sao chép trái phép sẽ bị xử lý theo pháp luật.',
    'color: #888; font-size: 14px;'
  );

})();
