require('dotenv').config();
const nodemailer = require('nodemailer');

const mailUser = (process.env.EMAIL_USER || '').trim();
const mailPass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');
const mailPort = Number(process.env.EMAIL_PORT) || 587;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  service: 'gmail',
  port: mailPort,
  secure: mailPort === 465,
  requireTLS: mailPort !== 465,
  tls: { minVersion: 'TLSv1.2' },
  auth: {
    user: mailUser,
    pass: mailPass,
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
});

async function run() {
  try {
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection OK. Sending test message...');

    const info = await transporter.sendMail({
      from: `"Test" <${mailUser}>`,
      to: (process.env.ADMIN_EMAIL || '').trim(),
      subject: 'Test email from Sunrise Gadgets (SMTP check)',
      text: 'If you receive this, SMTP is configured correctly.'
    });

    console.log('Message sent:', info.messageId || info.response);
  } catch (err) {
    console.error('SMTP test failed:', err && err.message ? err.message : err);
    process.exitCode = 1;
  }
}

run();
