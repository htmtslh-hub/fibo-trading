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
  //  7. Centralized blur state manager
  //     Prevents conflicts between different blur triggers
  // ══════════════════════════════════════════════════════════════
  const blurReasons = new Set();

  function applyBlur(reason, blurAmount) {
    blurReasons.add(reason);
    document.body.style.filter = 'blur(' + (blurAmount || 20) + 'px)';
  }

  function removeBlur(reason) {
    blurReasons.delete(reason);
    if (blurReasons.size === 0) {
      document.body.style.filter = '';
    }
  }

  function clearAllBlur() {
    blurReasons.clear();
    document.body.style.filter = '';
  }

  // ══════════════════════════════════════════════════════════════
  //  8. Visibility change detection (screen recording / tab switch)
  // ══════════════════════════════════════════════════════════════
  // blankOnHide is disabled by default to avoid issues
  let blankOnHide = false;

  document.addEventListener('visibilitychange', function () {
    if (document.hidden && blankOnHide) {
      applyBlur('visibility', 30);
    } else {
      removeBlur('visibility');
    }
  });

  // ══════════════════════════════════════════════════════════════
  //  9. Screen Capture API protection
  // ══════════════════════════════════════════════════════════════
  if (navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices) {
    navigator.mediaDevices.getDisplayMedia = function () {
      showShield(3000);
      return Promise.reject(new DOMException('Screen capture is disabled on this page.', 'NotAllowedError'));
    };
  }

  // ══════════════════════════════════════════════════════════════
  // 10. DevTools detection (improved — avoids false positives)
  //     Uses higher threshold + consecutive detection to reduce
  //     false positives from browser sidebars, extensions, etc.
  // ══════════════════════════════════════════════════════════════
  let devtoolsOpen = false;
  let devtoolsConsecutiveHits = 0;
  const DEVTOOLS_THRESHOLD = 200;       // px — higher to avoid false positives
  const DEVTOOLS_REQUIRED_HITS = 3;     // must detect N times in a row

  function detectDevTools() {
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;

    // On some browsers outerWidth/outerHeight can be 0 or negative
    // when window is minimized or not fully initialized
    if (window.outerWidth === 0 || window.outerHeight === 0) {
      return;
    }

    const isLikelyOpen = widthDiff > DEVTOOLS_THRESHOLD || heightDiff > DEVTOOLS_THRESHOLD;

    if (isLikelyOpen) {
      devtoolsConsecutiveHits++;
      if (devtoolsConsecutiveHits >= DEVTOOLS_REQUIRED_HITS && !devtoolsOpen) {
        devtoolsOpen = true;
        applyBlur('devtools', 20);
      }
    } else {
      devtoolsConsecutiveHits = 0;
      if (devtoolsOpen) {
        devtoolsOpen = false;
        removeBlur('devtools');
      }
    }
  }

  setInterval(detectDevTools, 1000);

  // ══════════════════════════════════════════════════════════════
  // 11. Safeguard: ensure blur is cleared on page load & focus
  //     Fixes cases where blur persists across navigations or
  //     after browser restores a cached (bfcache) page
  // ══════════════════════════════════════════════════════════════
  window.addEventListener('pageshow', function () {
    clearAllBlur();
    devtoolsConsecutiveHits = 0;
    devtoolsOpen = false;
  });

  window.addEventListener('focus', function () {
    // Small delay to let other handlers run first
    setTimeout(function () {
      removeBlur('visibility');
      // Re-check devtools so we don't accidentally leave it clear
      detectDevTools();
    }, 100);
  });

  // Also clear on initial DOMContentLoaded just in case
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', clearAllBlur);
  } else {
    clearAllBlur();
  }

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
