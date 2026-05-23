const { Resend } = require('resend');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = req.headers['x-internal-key'];
  if (key !== process.env.INTERNAL_API_KEY) return res.status(401).json({ error: 'Unauthorized' });

  const { type, to, data } = req.body;

  if (!type || !to || !data) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  let subject, html;

  switch (type) {
    case 'order_confirmation':
      subject = `Xác nhận đơn hàng #${data.orderNumber}`;
      html = orderConfirmationTemplate(data);
      break;
    default:
      return res.status(400).json({ error: 'Unknown email type' });
  }

  try {
    const { data: result, error } = await resend.emails.send({
      from: 'Fibo <noreply@fibo.vn>',
      to,
      subject,
      html
    });

    if (error) {
      console.error('Email error:', error.message);
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.json({ success: true, emailId: result?.id });
  } catch (e) {
    console.error('Email send failed:', e.message);
    return res.status(500).json({ success: false, message: e.message });
  }
};

function orderConfirmationTemplate(data) {
  const { customerName, orderNumber, total, items } = data;
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0B0B14;font-family:'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:22px;font-weight:800;color:#fff;">Nu</span><span style="font-size:22px;font-weight:800;color:#C8F560;">kia</span>
    </div>
    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:32px;">
      <h1 style="color:#fff;font-size:20px;margin:0 0 8px;">Thanh toán thành công!</h1>
      <p style="color:#8B8BA8;font-size:14px;margin:0 0 24px;">Xin chào ${customerName},</p>
      <p style="color:#8B8BA8;font-size:14px;line-height:1.6;margin:0 0 24px;">
        Đơn hàng <strong style="color:#fff;">#${orderNumber}</strong> đã được xác nhận. Bạn có thể truy cập khóa học ngay bây giờ.
      </p>
      <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:10px;padding:16px;margin-bottom:24px;">
        ${items.map(item => `
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
            <span style="color:#fff;font-size:14px;">${item.name}</span>
            <span style="color:#8B8BA8;font-size:14px;">${Number(item.price).toLocaleString('vi-VN')}đ</span>
          </div>
        `).join('')}
        <div style="display:flex;justify-content:space-between;padding:12px 0 0;">
          <span style="color:#fff;font-size:14px;font-weight:700;">Tổng cộng</span>
          <span style="color:#C8F560;font-size:14px;font-weight:700;">${Number(total).toLocaleString('vi-VN')}đ</span>
        </div>
      </div>
      <a href="https://fibo.vn/pages/courses.html" style="display:block;text-align:center;background:#fff;color:#0B0B14;padding:14px 28px;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none;">Truy cập khóa học</a>
    </div>
    <p style="text-align:center;color:#55556E;font-size:11px;margin-top:24px;">Nếu cần hỗ trợ, liên hệ qua Telegram hoặc email.</p>
  </div>
</body>
</html>`;
}
