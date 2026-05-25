(function() {
  var posts = [
    { slug: 'thuat-ngu-trading', title: 'Từ điển Trading — Giải thích 40+ thuật ngữ trader cần biết', category: 'Kiến thức' },
    { slug: 'tu-do-tai-chinh', title: 'Tự do tài chính — Đích đến thực sự của trader', category: 'Tư duy' },
    { slug: 'chi-so-aq', title: 'Chỉ số AQ — Yếu tố quyết định thành bại trong trading', category: 'Mindset' },
    { slug: 'so-vao-lenh', title: 'Vì sao bạn sợ vào lệnh — và cách thoát khỏi vòng xoáy', category: 'Tâm lý' },
    { slug: 'vay-no-va-don-bay', title: 'Vay nợ và đòn bẩy — Con dao hai lưỡi của trader', category: 'Tài chính' },
    { slug: 'don-gian-la-hieu-qua', title: 'Đơn giản không có nghĩa là kém hiệu quả', category: 'Kiến thức' },
    { slug: 'quan-ly-von', title: 'Quản lý vốn — Kỹ năng sống còn mà trader hay bỏ qua', category: 'Kiến thức' },
    { slug: 'nhat-ky-giao-dich', title: 'Nhật ký giao dịch — Vũ khí bí mật của trader chuyên nghiệp', category: 'Thực hành' },
    { slug: 'fomo-trong-trading', title: 'FOMO — Kẻ thù thầm lặng phá hủy tài khoản', category: 'Tâm lý' },
    { slug: 'kien-nhan-la-loi-the', title: 'Kiên nhẫn — Lợi thế cạnh tranh lớn nhất của trader', category: 'Mindset' },
    { slug: 'hoc-tu-sai-lam', title: 'Học từ sai lầm — Cách duy nhất để tiến bộ', category: 'Tư duy' },
    { slug: 'tai-sao-95-trader-thua', title: 'Tại sao 95% trader thua lỗ — Phân tích nguyên nhân thực sự', category: 'Kiến thức' },
    { slug: 'ky-luat-hon-chien-luoc', title: 'Kỷ luật quan trọng hơn chiến lược — Tại sao và làm thế nào', category: 'Mindset' },
    { slug: 'overtrading-ke-giet-tai-khoan', title: 'Overtrading — Kẻ giết tài khoản âm thầm nhất', category: 'Tâm lý' },
    { slug: 'risk-reward-ratio', title: 'Risk:Reward — Chỉ số quyết định bạn lãi hay lỗ dài hạn', category: 'Kiến thức' },
    { slug: 'trading-trong-vung', title: 'Trading in the Zone — Trạng thái tâm lý đỉnh cao của trader', category: 'Tâm lý' }
  ];

  var pages = [
    { url: 'courses.html', title: 'Khóa học', category: 'Trang' },
    { url: 'course-detail.html?id=1', title: 'Pro Trading 2.0 — Chi tiết khóa học', category: 'Trang' }
  ];

  function getBasePath() {
    var path = window.location.pathname;
    if (path.includes('/pages/')) return '';
    return 'pages/';
  }

  function createSearchModal() {
    var overlay = document.createElement('div');
    overlay.id = 'searchOverlay';
    overlay.innerHTML =
      '<div style="position:fixed;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(8px);z-index:999;display:flex;align-items:flex-start;justify-content:center;padding-top:12vh;" onclick="closeSearch(event)">' +
        '<div style="width:100%;max-width:560px;padding:0 16px;" onclick="event.stopPropagation()">' +
          '<div style="background:var(--bg-3,#15151F);border:1px solid var(--border,rgba(255,255,255,.05));border-radius:16px;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.5);">' +
            '<div style="padding:16px;border-bottom:1px solid var(--border,rgba(255,255,255,.05));">' +
              '<div style="display:flex;align-items:center;gap:12px;">' +
                '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-3,#55556E)" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
                '<input type="text" id="searchInput" placeholder="Tìm kiếm bài viết..." style="flex:1;background:none;border:none;outline:none;color:var(--text,#fff);font-size:15px;font-family:inherit;" autocomplete="off">' +
                '<kbd style="font-size:11px;color:var(--text-3,#55556E);background:var(--bg-4,#1A1A26);padding:3px 8px;border-radius:4px;border:1px solid var(--border,rgba(255,255,255,.05));">ESC</kbd>' +
              '</div>' +
            '</div>' +
            '<div id="searchResults" style="max-height:400px;overflow-y:auto;padding:8px;"></div>' +
          '</div>' +
        '</div>' +
      '</div>';
    overlay.style.display = 'none';
    document.body.appendChild(overlay);

    var input = document.getElementById('searchInput');
    input.addEventListener('input', function() { doSearch(this.value); });
  }

  function doSearch(query) {
    var results = document.getElementById('searchResults');
    if (!query || query.length < 2) {
      results.innerHTML = '<div style="padding:24px;text-align:center;color:var(--text-3,#55556E);font-size:13px;">Nhập từ khóa để tìm kiếm...</div>';
      return;
    }

    var q = query.toLowerCase();
    var basePath = getBasePath();

    var matched = posts.filter(function(p) {
      return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    });

    var matchedPages = pages.filter(function(p) {
      return p.title.toLowerCase().includes(q);
    });

    if (matched.length === 0 && matchedPages.length === 0) {
      results.innerHTML = '<div style="padding:24px;text-align:center;color:var(--text-3,#55556E);font-size:13px;">Không tìm thấy kết quả cho "' + query + '"</div>';
      return;
    }

    var html = '';

    if (matchedPages.length > 0) {
      html += matchedPages.map(function(p) {
        return '<a href="' + basePath + p.url + '" style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:10px;text-decoration:none;color:inherit;transition:background .2s;" onmouseover="this.style.background=\'rgba(255,255,255,.04)\'" onmouseout="this.style.background=\'none\'">' +
          '<div style="width:36px;height:36px;border-radius:8px;background:rgba(255,255,255,.04);display:flex;align-items:center;justify-content:center;flex-shrink:0;">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent,#C8F560)" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></svg>' +
          '</div>' +
          '<div><div style="font-size:14px;font-weight:600;color:var(--text,#fff);">' + p.title + '</div><div style="font-size:11px;color:var(--text-3,#55556E);margin-top:2px;">' + p.category + '</div></div>' +
        '</a>';
      }).join('');
    }

    if (matched.length > 0) {
      html += matched.map(function(p) {
        return '<a href="' + basePath + 'blog-post.html?slug=' + p.slug + '" style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:10px;text-decoration:none;color:inherit;transition:background .2s;" onmouseover="this.style.background=\'rgba(255,255,255,.04)\'" onmouseout="this.style.background=\'none\'">' +
          '<div style="width:36px;height:36px;border-radius:8px;background:rgba(255,255,255,.04);display:flex;align-items:center;justify-content:center;flex-shrink:0;">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3,#55556E)" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' +
          '</div>' +
          '<div><div style="font-size:14px;font-weight:600;color:var(--text,#fff);">' + p.title + '</div><div style="font-size:11px;color:var(--text-3,#55556E);margin-top:2px;">' + p.category + '</div></div>' +
        '</a>';
      }).join('');
    }

    results.innerHTML = html;
  }

  window.openSearch = function() {
    var overlay = document.getElementById('searchOverlay');
    overlay.style.display = 'block';
    setTimeout(function() { document.getElementById('searchInput').focus(); }, 100);
  };

  window.closeSearch = function(e) {
    if (e && e.target !== e.currentTarget) return;
    document.getElementById('searchOverlay').style.display = 'none';
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '';
  };

  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape') {
      var overlay = document.getElementById('searchOverlay');
      if (overlay && overlay.style.display === 'block') closeSearch();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createSearchModal);
  } else {
    createSearchModal();
  }
})();
