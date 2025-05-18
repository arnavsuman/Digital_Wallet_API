const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'live.smtp.mailtrap.io',
  port: 587,
  secure: false,
  auth: {
    user: "api",//process.env.ALERT_EMAIL
    pass: "9c7992e7a4519a5bc72e81322376bb50", //process.env.ALERT_EMAIL_PASSWORD, // Use App Password, not Gmail password
  },
});

exports.sendFlaggedAlert = async (transaction) => {
  const mailOptions = {
    from: `"Fraud Alert" <hello@demomailtrap.co>`,
    to: "user123456789tester@gmail.com", // The admin to notify
    subject: '⚠️ Flagged Transaction Alert',
    html: `
      <h3>Suspicious Transaction Detected! Take Action </h3>
      <p><strong>Type:</strong> ${transaction.type}</p>
      <p><strong>From:</strong> ${transaction.from}</p>
      <p><strong>To:</strong> ${transaction.to}</p>
      <p><strong>Amount:</strong> ${transaction.amount}</p>
      <p><strong>Time:</strong> ${transaction.timestamp}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email alert sent for transaction ${transaction._id}`);
  } catch (err) {
    console.error('Failed to send alert email:', err);
  }
};
