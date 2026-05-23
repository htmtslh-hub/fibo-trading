const { getAdminDb } = require('../firebase-admin');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { customer, items, total, orderNumber } = req.body;

    if (!customer || !items || !total || !orderNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!customer.name || !customer.email || !customer.phone) {
      return res.status(400).json({ error: 'Missing customer info' });
    }

    const db = getAdminDb();

    const orderData = {
      orderNumber,
      customer,
      items,
      total,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.collection('orders').doc(orderNumber).set(orderData);

    return res.json({ success: true, orderNumber });
  } catch (e) {
    console.error('Checkout error:', e.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
