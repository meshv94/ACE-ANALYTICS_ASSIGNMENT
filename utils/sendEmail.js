const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmailReminders = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Success ------------------ Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed --------------------- to send email to ${to}:`, error.message);
  }
};

const sendEmailOTP = async (to, otp) => {
    let subject = 'Verify Your Email'
    let text = `Your OTP code is: ${otp}. It expires in 10 minutes.`

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Success ------------------ Email sent to ${to}`);
    } catch (error) {
      console.error(`Failed --------------------- to send email to ${to}:`, error.message);
    }
  };

module.exports = { sendEmailReminders , sendEmailOTP };
