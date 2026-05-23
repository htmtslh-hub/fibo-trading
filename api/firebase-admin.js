const admin = require('firebase-admin');

let db;

function getAdminDb() {
  if (!db) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    if (!admin.apps.length) {
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    }
    db = admin.firestore();
  }
  return db;
}

module.exports = { getAdminDb, admin };
