import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "OTP Verification - Eventure",
    text,
  };

  await transporter.sendMail(mailOptions);
};
