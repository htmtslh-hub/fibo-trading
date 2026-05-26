(async function() {
  try {
    // Lọc bot/crawler
    var ua = navigator.userAgent.toLowerCase();
    var bots = ['bot', 'crawler', 'spider', 'slurp', 'mediapartners', 'facebookexternalhit', 'bytespider', 'semrush', 'ahref', 'lighthouse', 'pagespeed', 'gtmetrix'];
    var isBot = bots.some(function(b) { return ua.indexOf(b) !== -1; });
    if (isBot) return;

    var { db, doc, getDoc, setDoc, increment } = await import('/firebase.js');

    var today = new Date().toISOString().split('T')[0];
    var page = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';

    // Session ID — unique per browser session (tab close = new session)
    var sessionId = sessionStorage.getItem('fibo_session');
    if (!sessionId) {
      sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
      sessionStorage.setItem('fibo_session', sessionId);
    }

    // Visitor ID — unique per device (persists across sessions)
    var visitorId = localStorage.getItem('fibo_visitor');
    var isNewVisitor = false;
    if (!visitorId) {
      visitorId = 'vis_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
      localStorage.setItem('fibo_visitor', visitorId);
      isNewVisitor = true;
    }

    // Chống đếm trùng: mỗi page chỉ đếm 1 lần per session
    var viewedKey = 'fibo_viewed_' + today;
    var viewed = JSON.parse(sessionStorage.getItem(viewedKey) || '[]');
    if (viewed.indexOf(page) !== -1) return;
    viewed.push(page);
    sessionStorage.setItem(viewedKey, JSON.stringify(viewed));

    // 1. Ghi tổng views theo ngày (giữ tương thích admin cũ)
    var dayRef = doc(db, 'page_views', today);
    var daySnap = await getDoc(dayRef);
    if (daySnap.exists()) {
      await setDoc(dayRef, {
        views: increment(1),
        uniqueVisitors: increment(isNewVisitor ? 1 : 0),
        lastVisit: new Date().toISOString()
      }, { merge: true });
    } else {
      await setDoc(dayRef, {
        date: today,
        views: 1,
        uniqueVisitors: isNewVisitor ? 1 : 0,
        lastVisit: new Date().toISOString()
      });
    }

    // 2. Ghi views theo trang
    var pageId = today + '_' + page.replace(/\//g, '_');
    var pageRef = doc(db, 'page_views_detail', pageId);
    var pageSnap = await getDoc(pageRef);
    if (pageSnap.exists()) {
      await setDoc(pageRef, { views: increment(1) }, { merge: true });
    } else {
      await setDoc(pageRef, { date: today, page: page, views: 1 });
    }

  } catch (e) {}
})();
