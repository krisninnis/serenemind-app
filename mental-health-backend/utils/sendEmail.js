const nodemailer = require("nodemailer");

async function sendEmail({ to, subject, html }) {
  // Create transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: "gmail", // you can change this to your email provider
    auth: {
      user: process.env.EMAIL_USER, // your email address from .env
      pass: process.env.EMAIL_PASS, // your email app password or real password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
