const admin = require('firebase-admin');

let db;

function getAdminDb() {
  if (!db) {
    let serviceAccount;
    try {
      let rawJson = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (!rawJson) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not defined.');
      }
      
      // Handle cases where the env var might be wrapped in extra double quotes
      if (rawJson.startsWith('"') && rawJson.endsWith('"')) {
        rawJson = JSON.parse(rawJson);
      }
      
      serviceAccount = typeof rawJson === 'object' ? rawJson : JSON.parse(rawJson);
      
      // Fix potential Vercel newline escape issues with the private key
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
    } catch (err) {
      console.error('Error parsing FIREBASE_SERVICE_ACCOUNT:', err.message);
      throw err;
    }

    if (!admin.apps.length) {
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    }
    db = admin.firestore();
  }
  return db;
}

module.exports = { getAdminDb, admin };
