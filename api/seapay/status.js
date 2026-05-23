const { getAdminDb } = require('../firebase-admin');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { orderNumber } = req.query;

  if (!orderNumber) {
    return res.status(400).json({ error: 'Missing orderNumber' });
  }

  try {
    const db = getAdminDb();
    const orderRef = db.collection('orders').doc(orderNumber);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderSnap.data();

    return res.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        total: order.total,
        paidAt: order.paidAt || null
      }
    });
  } catch (e) {
    console.error('Status check error:', e.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
