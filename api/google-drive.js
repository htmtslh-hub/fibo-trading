const { google } = require('googleapis');

async function shareDriveFolder(email, role = 'reader') {
  let credentials;
  try {
    let rawJson = process.env.GOOGLE_SERVICE_ACCOUNT;
    if (!rawJson) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT environment variable is not defined.');
    }
    if (rawJson.startsWith('"') && rawJson.endsWith('"')) {
      rawJson = JSON.parse(rawJson);
    }
    credentials = typeof rawJson === 'object' ? rawJson : JSON.parse(rawJson);
    if (credentials.private_key) {
      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
    }
  } catch (err) {
    console.error('Error parsing GOOGLE_SERVICE_ACCOUNT:', err.message);
    throw err;
  }
  const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive']
  });

  const drive = google.drive({ version: 'v3', auth });

  await drive.permissions.create({
    fileId: FOLDER_ID,
    requestBody: {
      type: 'user',
      role: role,
      emailAddress: email
    },
    sendNotificationEmail: true
  });

  return { success: true, email, folderId: FOLDER_ID };
}

module.exports = { shareDriveFolder };
