const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const transporter = nodemailer.createTransport(
  smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  })
);

exports.sendEmailVerification = async (code, address) => {
  const info = await transporter.sendMail({
    from: `"Test account" <${process.env.EMAIL}>`,
    to: address,
    subject: 'Hello ✔',
    text: 'Verification code',
    html: ` <h1>Test account</h1>
            <p>Your verification code - <strong>${code}</strong></p>`,
  });

  return nodemailer.getTestMessageUrl(info);
};
