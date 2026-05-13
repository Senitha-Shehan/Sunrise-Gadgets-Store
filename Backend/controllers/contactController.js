const nodemailer = require('nodemailer');

// Configure SMTP Transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Handle contact form submission
 */
const sendContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log(`📧 Processing contact form from: ${email}...`);

    // Email to admin
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, sans-serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius: 10px; overflow:hidden;">
                <tr>
                  <td style="background: linear-gradient(135deg, #0F6E56 0%, #06B6D4 100%); padding: 40px; text-align:center; color:#ffffff;">
                    <h1 style="margin:0; font-size: 24px; text-transform: uppercase;">New Contact Form Submission</h1>
                    <p style="margin:5px 0 0; opacity:0.8; font-size: 12px; letter-spacing: 2px;">SUNRISE GADGETS STORE</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px; color: #333333;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr style="border-bottom: 1px solid #eeeeee;">
                        <td style="padding: 12px 0; font-weight: bold; width: 120px; color: #0F6E56;">Name:</td>
                        <td style="padding: 12px 0;">${name}</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #eeeeee;">
                        <td style="padding: 12px 0; font-weight: bold; color: #0F6E56;">Email:</td>
                        <td style="padding: 12px 0;"><a href="mailto:${email}" style="color: #06B6D4; text-decoration: none;">${email}</a></td>
                      </tr>
                      <tr style="border-bottom: 1px solid #eeeeee;">
                        <td style="padding: 12px 0; font-weight: bold; color: #0F6E56;">Phone:</td>
                        <td style="padding: 12px 0;">${phone || 'Not provided'}</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #eeeeee;">
                        <td style="padding: 12px 0; font-weight: bold; color: #0F6E56;">Subject:</td>
                        <td style="padding: 12px 0;">${subject}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding: 20px 0; font-weight: bold; color: #0F6E56;">Message:</td>
                      </tr>
                    </table>
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #06B6D4; margin: 15px 0; line-height: 1.6; white-space: pre-wrap; color: #333333;">
                      ${message}
                    </div>
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 12px; color: #888888;">
                      <p style="margin: 0;">This is an automated notification from Sunrise Gadgets Store website. Please reply to ${email} directly.</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Email to customer (confirmation)
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, sans-serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius: 10px; overflow:hidden;">
                <tr>
                  <td style="background: linear-gradient(135deg, #0F6E56 0%, #06B6D4 100%); padding: 40px; text-align:center; color:#ffffff;">
                    <h1 style="margin:0; font-size: 24px; text-transform: uppercase;">SUNRISE GADGETS STORE</h1>
                    <p style="margin:5px 0 0; opacity:0.8; font-size: 12px; letter-spacing: 2px;">Expect More Pay Less</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px; color: #333333; line-height: 1.6;">
                    <h2 style="color: #0F6E56; margin-top: 0;">Message Received!</h2>
                    <p>Hi ${name}, thank you for reaching out to Sunrise Gadgets Store.</p>
                    <p>We've received your message about <strong>"${subject}"</strong> and our team will get back to you within 1 business day.</p>
                    
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #06B6D4;">
                      <p style="margin: 0 0 8px; color: #666666;"><strong>Your contact details:</strong></p>
                      <p style="margin: 2px 0;">Email: ${email}</p>
                      <p style="margin: 2px 0;">Phone: ${phone || 'Not provided'}</p>
                    </div>

                    <p>If you don't hear from us within 24 hours, feel free to call us directly or visit our showroom:</p>
                    <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 15px 0; font-size: 14px; color: #333333;">
                      <p style="margin: 8px 0;"><strong>📞 Phone:</strong> +94 11 234 5678</p>
                      <p style="margin: 8px 0;"><strong>📍 Showroom:</strong> 123 Galle Road, Colombo 03, Sri Lanka</p>
                      <p style="margin: 8px 0;"><strong>⏰ Hours:</strong> Mon–Sat, 9 AM – 6 PM</p>
                      <p style="margin: 8px 0;"><strong>💬 WhatsApp:</strong> +94 71 622 2203</p>
                    </div>

                    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 12px; color: #888888;">
                      Thank you for choosing Sunrise Gadgets Store!<br>
                      Best regards,<br>
                      <strong>The Sunrise Gadgets Team</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Send email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'sunrisegadgetsstore.lk@gmail.com',
      subject: `New Contact Form: ${subject}`,
      html: adminEmailHtml
    });

    console.log(`✅ Admin notification sent to sunrisegadgetsstore.lk@gmail.com`);

    // Send confirmation email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'We received your message - Sunrise Gadgets Store',
      html: customerEmailHtml
    });

    console.log(`✅ Confirmation email sent to ${email}`);

    res.status(200).json({ 
      success: true, 
      message: 'Your message has been sent successfully. We will get back to you soon!' 
    });

  } catch (error) {
    console.error('❌ Contact form error:', error);
    res.status(500).json({ 
      error: 'Failed to send message. Please try again later.',
      details: error.message 
    });
  }
};

module.exports = { sendContactMessage };
