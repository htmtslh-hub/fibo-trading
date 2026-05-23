(async function() {
  try {
    var { db, doc, getDoc, setDoc, increment } = await import('/firebase.js');
    var today = new Date().toISOString().split('T')[0];
    var page = window.location.pathname || '/';
    var docRef = doc(db, 'page_views', today);
    var snap = await getDoc(docRef);
    if (snap.exists()) {
      await setDoc(docRef, { views: increment(1), lastVisit: new Date().toISOString() }, { merge: true });
    } else {
      await setDoc(docRef, { date: today, views: 1, lastVisit: new Date().toISOString() });
    }
  } catch (e) {}
})();
