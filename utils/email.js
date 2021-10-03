const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Activate in gmail "less secure app" option
    // We will use mailtrap
  });

  // 2. Define email options
  const mailOptions = {
    from: 'Jibran Advani <jibran@google.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
