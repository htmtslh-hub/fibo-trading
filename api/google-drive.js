const { google } = require('googleapis');

async function shareDriveFolder(email, role = 'reader') {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
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
