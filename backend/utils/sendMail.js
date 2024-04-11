const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  // options = {email, subject, message}
  const transporter = nodemailer.createTransport({
    // Tạo transporter
    host: process.env.SMPT_HOST, // Lấy host từ file .env
    port: process.env.SMPT_PORT, // Lấy port từ file .env
    service: process.env.SMPT_SERVICE, // Lấy service từ file .env
    auth: {
      // Lấy auth từ file .env
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    // Tạo mailOptions
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions); // Gửi mail
};

module.exports = sendMail;
