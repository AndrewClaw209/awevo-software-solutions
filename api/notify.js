const nodemailer = require('nodemailer');

const recipient = 'luisgomezbvt2023@gmail.com';

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = request.body || {};
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 120 ||
      typeof email !== 'string' || email.trim().length < 5 || email.trim().length > 254 ||
      typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 5000) {
    return response.status(400).json({ error: 'Invalid inquiry' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: recipient, pass: process.env.GMAIL_APP_PASSWORD },
  });

  try {
    await transporter.sendMail({
      from: `AWEVO Website <${recipient}>`,
      to: recipient,
      replyTo: email.trim(),
      subject: `New AWEVO inquiry from ${name.trim()}`,
      text: [
        'New inquiry received from the AWEVO Software Solutions website.',
        '',
        `Name: ${name.trim()}`,
        `Email: ${email.trim()}`,
        '',
        message.trim(),
      ].join('\n'),
    });
    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error('Notification delivery failed', error);
    return response.status(502).json({ error: 'Notification delivery failed' });
  }
};
