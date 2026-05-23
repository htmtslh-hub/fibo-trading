const { getAdminDb } = require('../firebase-admin');
const { shareDriveFolder } = require('../google-drive');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const vercelApiKey = process.env.SEPAY_API_KEY || '';
    return res.json({
      diagnostic: 'SePay Webhook GET Endpoint active',
      vercelKeyLength: vercelApiKey.length,
      vercelKeyFirstChar: vercelApiKey.charAt(0) || 'empty',
      vercelKeyLastChar: vercelApiKey.charAt(vercelApiKey.length - 1) || 'empty'
    });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const rawAuthHeader = req.headers['authorization'] || '';
  const rawXApiKey = req.headers['x-api-key'] || '';
  let apiKey = rawAuthHeader || rawXApiKey || '';
  apiKey = apiKey.trim();
  
  if (apiKey.toLowerCase().startsWith('apikey ')) {
    apiKey = apiKey.substring(7).trim();
  } else if (apiKey.toLowerCase().startsWith('bearer ')) {
    apiKey = apiKey.substring(7).trim();
  }
  
  const expectedKey = (process.env.SEPAY_API_KEY || '').trim();
  
  if (apiKey !== expectedKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      debug: {
        rawAuthHeader: rawAuthHeader,
        rawXApiKey: rawXApiKey,
        parsedKeyLength: apiKey.length,
        parsedKeyFirst3: apiKey.substring(0, 3),
        parsedKeyLast3: apiKey.substring(apiKey.length - 3),
        expectedKeyLength: expectedKey.length,
        expectedKeyFirst3: expectedKey.substring(0, 3),
        expectedKeyLast3: expectedKey.substring(expectedKey.length - 3)
      }
    });
  }

  try {
    const { transferAmount, content, transactionDate } = req.body;

    if (!content) return res.json({ success: false, message: 'No content' });

    const match = content.match(/FB\d+/);
    if (!match) return res.json({ success: false, message: 'No order number found' });

    const orderNumber = match[0];
    const db = getAdminDb();
    const orderRef = db.collection('orders').doc(orderNumber);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return res.json({ success: false, message: 'Order not found' });
    }

    const order = orderSnap.data();

    if (order.paymentStatus === 'paid') {
      return res.json({ success: true, message: 'Already paid' });
    }

    if (Number(transferAmount) < order.total) {
      return res.json({ success: false, message: 'Amount mismatch' });
    }

    await orderRef.update({
      paymentStatus: 'paid',
      paidAt: new Date().toISOString(),
      transactionDate: transactionDate || null,
      updatedAt: new Date().toISOString()
    });

    // Share Google Drive (await to ensure completion in serverless environments)
    try {
      await shareDriveFolder(order.customer.email);
    } catch (e) {
      console.error('Drive share failed:', e.message);
    }

    // Trigger email (await to ensure completion in serverless environments)
    try {
      const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
      const emailRes = await fetch(`${baseUrl}/api/email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Internal-Key': process.env.INTERNAL_API_KEY },
        body: JSON.stringify({
          type: 'order_confirmation',
          to: order.customer.email,
          data: { customerName: order.customer.name, orderNumber, total: order.total, items: order.items }
        })
      });
      const emailData = await emailRes.json();
      console.log('Email send result:', emailData);
    } catch (e) {
      console.error('Email trigger failed:', e.message);
    }

    return res.json({ success: true, orderNumber });
  } catch (e) {
    console.error('Webhook error:', e.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
