import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const sendEmail = async (to, text) => {
  const mailOptions = {
    from: EMAIL_USER,
    to,
    subject: "OTP Verification - Eventure",
    text,
  };

  await transporter.sendMail(mailOptions);
};
