require("dotenv").config();
const emailHelper = {};

// const mailgun = require("mailgun-js");
// const DOMAIN = process.env.MAILGUN_API_DOMAIN;
// const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });
// const data = {
//   from: `Mailgun Sandbox <postmaster@${process.env.MAILGUN_API_DOMAIN}>`,
//   to: "lklinh@outlook.com",
//   subject: "Hello",
//   text: "Testing some Mailgun awesomeness!",
// };
// mg.messages().send(data, function (error, body) {
//   console.log(body);
// });

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  ignoreTLS: false,
  secure: false,
  auth: {
    user: "homstayhotel@gmail.com",
    pass: process.env.EMAIL_PASS,
  },
});

emailHelper.sendBookingConfirmEmail = (email, bookingNo) => {
  const mailOptions = {
    from: "homstayhotel@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Booking confirmation at hom", // Subject line
    html: `<p>Here's your booking number: <b><u>${bookingNo}</u></b>.<br/> Please log in to our website for further details. Thank you for choosing us!</p>`, // plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
};

module.exports = emailHelper;
