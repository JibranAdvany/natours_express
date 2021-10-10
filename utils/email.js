const pug = require('pug');
const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    (this.to = user.email), (this.firstName = user.name.split(' ')[0]);
    this.url = url;
    this.from = `Jibran Advani <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      // Activate in gmail "less secure app" option
      // We will use mailtrap
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1. Render HTML for the email based on pug template.
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2. Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    // 3. Create a transport and send email
    this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordreset',
      'Your password reset token (valid for only 10 minutes'
    );
  }
};

// const sendEmail = async options => {
// 1. Create a transporter
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   auth: {
//     user: process.env.EMAIL_NAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
//   // Activate in gmail "less secure app" option
//   // We will use mailtrap
// });

// 2. Define email options
// const mailOptions = {
//   from: 'Jibran Advani <jibran@google.com>',
//   to: options.email,
//   subject: options.subject,
//   text: options.message,
//   // html:
// };

// 3. Send the email
// await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
