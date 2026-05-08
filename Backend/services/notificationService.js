const nodemailer = require('nodemailer');

const mailUser = (process.env.EMAIL_USER || '').trim();
const mailPass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');
const mailPort = Number(process.env.EMAIL_PORT) || 587;
const isGmail = (process.env.EMAIL_HOST || '').toLowerCase().includes('gmail');

// Configure SMTP Transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  service: isGmail ? 'gmail' : undefined,
  port: mailPort,
  secure: mailPort === 465,
  requireTLS: mailPort !== 465,
  tls: {
    minVersion: 'TLSv1.2',
  },
  auth: {
    user: mailUser,
    pass: mailPass
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
});

/**
 * Sends a premium invoice email to the customer
 */
const sendCustomerInvoice = async (order) => {
  try {
    const { customer, items, summary } = order;
    const orderId = order._id.toString().slice(-6).toUpperCase();
    
    console.log(`✉️ Attempting to send customer invoice to: ${customer.email}...`);

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 15px 0; border-bottom: 1px solid #eeeeee; font-family: Arial, sans-serif;">
          <strong style="color: #333333; font-size: 14px;">${item.name}</strong><br>
          <span style="color: #888888; font-size: 12px;">Quantity: ${item.quantity}</span>
        </td>
        <td align="right" style="padding: 15px 0; border-bottom: 1px solid #eeeeee; font-family: Arial, sans-serif; color: #185FA5; font-weight: bold;">
          Rs. ${Number(item.price).toLocaleString()}
        </td>
      </tr>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <body style="margin:0; padding:0; background-color:#f4f4f4;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius: 10px; overflow:hidden;">
                <tr>
                  <td style="background-color:#185FA5; padding: 40px; text-align:center; color:#ffffff; font-family: Arial, sans-serif;">
                    <h1 style="margin:0; font-size: 24px; text-transform: uppercase;">SUNRISE GADGETS STORE</h1>
                    <p style="margin:5px 0 0; opacity:0.8; font-size: 12px; letter-spacing: 2px;">Expect More Pay Less</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px; font-family: Arial, sans-serif; color: #444444; line-height: 1.6;">
                    <h2 style="color: #333333;">Order Confirmed!</h2>
                    <p>Hi ${customer.name}, we've received your order and are processing it for delivery to <b>${customer.district}</b>.</p>
                    
                    <div style="background:#f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                      <small style="color:#999999; text-transform:uppercase; font-weight:bold;">Order ID</small><br>
                      <b style="font-size: 18px;">#${orderId}</b>
                    </div>

                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <th align="left" style="padding-bottom: 10px; border-bottom: 2px solid #eeeeee; font-size: 12px; color:#999999; text-transform:uppercase;">Item</th>
                        <th align="right" style="padding-bottom: 10px; border-bottom: 2px solid #eeeeee; font-size: 12px; color:#999999; text-transform:uppercase;">Price</th>
                      </tr>
                      ${itemsHtml}
                      <tr>
                        <td style="padding-top: 20px; font-size: 14px; color:#777777;">Subtotal</td>
                        <td align="right" style="padding-top: 20px; font-weight: bold;">Rs. ${summary.subtotal.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; font-size: 14px; color:#777777;">Shipping</td>
                        <td align="right" style="padding: 5px 0; font-weight: bold;">Rs. ${summary.shipping.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td style="padding-top: 15px; border-top: 2px solid #eeeeee; font-size: 18px; font-weight: bold;">Total</td>
                        <td align="right" style="padding-top: 15px; border-top: 2px solid #eeeeee; font-size: 22px; font-weight: bold; color: #0F6E56;">Rs. ${summary.total.toLocaleString()}</td>
                      </tr>
                    </table>

                    <div style="margin-top: 30px; border: 1px dashed #cccccc; padding: 20px; border-radius: 8px;">
                      <small style="color:#999999; text-transform:uppercase; font-weight:bold;">Shipping To:</small><br>
                      <p style="margin: 5px 0 0;">
                        ${customer.name}<br>
                        ${customer.address}<br>
                        ${customer.district}<br>
                        <b>${customer.phone}</b>
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background:#eeeeee; padding: 20px; text-align:center; font-family: Arial, sans-serif; font-size: 11px; color: #999999;">
                    &copy; 2026 Sunrise Gadgets Store. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Sunrise Gadgets" <${mailUser}>`,
      to: customer.email,
      subject: `Order Confirmation #${orderId} - Sunrise Gadgets`,
      html: emailHtml
    });

    console.log(`✅ Success: Confirmation email sent to customer: ${customer.email}`);
  } catch (error) {
    console.error(`❌ Error sending customer email to ${order.customer.email}:`, error.message);
  }
};

/**
 * Sends a high-priority alert email to the admin
 */
const sendAdminNotification = async (order) => {
  try {
    const { customer, summary, items } = order;
    const orderId = order._id.toString().slice(-6).toUpperCase();

    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #e11d48; border-radius: 10px;">
        <h2 style="color: #e11d48; margin-top: 0;">🚀 NEW ORDER RECEIVED</h2>
        <p style="font-size: 24px; font-weight: bold; color: #333;">Total: Rs. ${summary.total.toLocaleString()}</p>
        <hr>
        <p><b>Customer:</b> ${customer.name}</p>
        <p><b>District:</b> ${customer.district}</p>
        <p><b>Phone:</b> ${customer.phone}</p>
        <p><b>Items:</b><br>${items.map(i => `${i.quantity}x ${i.name}`).join('<br>')}</p>
        <br>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Dashboard</a>
      </div>
    `;

    await transporter.sendMail({
      from: `"Store Alerts" <${mailUser}>`,
      to: (process.env.ADMIN_EMAIL || '').trim(),
      subject: `🚨 NEW ORDER #${orderId}: ${customer.name}`,
      html: adminEmailHtml
    });

    console.log(`🚀 Success: Admin notification sent for Order #${orderId}`);
  } catch (error) {
    console.error(`❌ Error sending admin notification:`, error.message);
  }
};

module.exports = { sendCustomerInvoice, sendAdminNotification };
