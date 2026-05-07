const nodemailer = require('nodemailer');

// Configure SMTP Transporter
// NOTE: User needs to fill these in their .env file
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendCustomerInvoice = async (order) => {
  const { customer, items, summary } = order;
  
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #edf2f7;">
        <div style="font-weight: bold; color: #1a202c;">${item.name}</div>
        <div style="font-size: 12px; color: #718096;">Qty: ${item.quantity}</div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #edf2f7; text-align: right; color: #1a202c;">
        Rs. ${item.price.toLocaleString()}
      </td>
    </tr>
  `).join('');

  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #edf2f7; border-radius: 16px; overflow: hidden; background: #fff;">
      <div style="background: #1a202c; padding: 40px; text-align: center;">
        <h1 style="color: #f97316; margin: 0; font-size: 28px; letter-spacing: -1px;">SUNRISE GADGETS</h1>
        <p style="color: #a0aec0; margin: 10px 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Order Confirmation</p>
      </div>
      
      <div style="padding: 40px;">
        <h2 style="color: #1a202c; margin-top: 0;">Hi ${customer.name},</h2>
        <p style="color: #4a5568; line-height: 1.6;">Thank you for your order! We've received your request and our team is preparing it for delivery to <b>${customer.district}</b>.</p>
        
        <div style="margin: 30px 0; padding: 20px; background: #f7fafc; border-radius: 12px;">
          <div style="font-size: 12px; color: #718096; text-transform: uppercase; margin-bottom: 5px;">Order Number</div>
          <div style="font-weight: bold; color: #1a202c;">#${order._id.toString().slice(-6).toUpperCase()}</div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 12px; color: #718096; font-size: 12px; text-transform: uppercase;">Product</th>
              <th style="text-align: right; padding: 12px; color: #718096; font-size: 12px; text-transform: uppercase;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="border-top: 2px solid #edf2f7; padding-top: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #4a5568;">
            <span>Subtotal</span>
            <span>Rs. ${summary.subtotal.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #4a5568;">
            <span>Shipping</span>
            <span>Rs. ${summary.shipping.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 20px; padding-top: 15px; border-top: 1px solid #edf2f7;">
            <span style="font-weight: bold; color: #1a202c; font-size: 18px;">Total</span>
            <span style="font-weight: bold; color: #f97316; font-size: 22px;">Rs. ${summary.total.toLocaleString()}</span>
          </div>
        </div>

        <div style="margin-top: 40px; padding: 20px; border: 1px dashed #e2e8f0; border-radius: 12px;">
          <h4 style="margin: 0 0 10px; color: #1a202c;">Delivery Details</h4>
          <p style="margin: 0; font-size: 14px; color: #4a5568;">
            ${customer.address}<br>
            ${customer.district}<br>
            Phone: ${customer.phone}
          </p>
        </div>
      </div>
      
      <div style="background: #f7fafc; padding: 30px; text-align: center; font-size: 12px; color: #a0aec0;">
        <p>&copy; 2026 Sunrise Gadgets Store. All rights reserved.</p>
        <p>If you have any questions, contact us at info@sunrisegadgets.lk</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Sunrise Gadgets" <${process.env.EMAIL_USER}>`,
    to: customer.email,
    subject: `Order Confirmation #${order._id.toString().slice(-6).toUpperCase()} - Sunrise Gadgets`,
    html: emailHtml
  });
};

const sendAdminNotification = async (order) => {
  const { customer, summary } = order;
  
  // NOTE: This sends an automated email to the admin.
  // For TRUE automated WhatsApp (server-side), you need a WhatsApp Business API key.
  // We can also send this to the admin email so they are notified immediately.
  
  const adminEmailHtml = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>🚀 New Order Received!</h2>
      <p>A new order has been placed by <b>${customer.name}</b>.</p>
      <ul>
        <li><b>Order Total:</b> Rs. ${summary.total.toLocaleString()}</li>
        <li><b>Customer District:</b> ${customer.district}</li>
        <li><b>Phone:</b> ${customer.phone}</li>
      </ul>
      <p>Check the admin dashboard for full details.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Store Alerts" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🚨 NEW ORDER: ${customer.name} - Rs. ${summary.total.toLocaleString()}`,
    html: adminEmailHtml
  });
};

module.exports = { sendCustomerInvoice, sendAdminNotification };
