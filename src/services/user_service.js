import { validate } from "../validation/validation.js";
import { ResponseError } from "../exceptions/exceptions.js";
import prisma from "../application/database.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendEmail } from "./email_service.js";
import { db, config } from "../config/database.js";

const OTP_EXPIRATION_MINUTES = 30;

const register = async (fullName, email, password) => {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: passwordHash,
    },
  });

  const otpCode = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60 * 1000);

  await prisma.emailVerification.create({
    data: {
      otpCode,
      expiresAt,
      userId: user.id,
    },
  });

  await sendEmail(email, `Your OTP code is: ${otpCode}`);
  return user;
};

const verifyOtp = async (email, otpCode) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { emailVerifications: true },
  });

  if (!user) throw new Error("User not found");

  const emailVerification = user.emailVerifications.find(
    (ev) => ev.otpCode === otpCode && !ev.isUsed && ev.expiresAt > new Date()
  );

  if (!emailVerification) throw new Error("Invalid or expired OTP");

  await prisma.user.update({
    where: { id: user.id },
    data: { isActive: true },
  });

  await prisma.emailVerification.update({
    where: { id: emailVerification.id },
    data: { isUsed: true },
  });

  return user;
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign({ id: user.id }, config.jwtSecret, {
    expiresIn: config.jwtExpiration,
  });

  return token;
};

const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export default {
  register,
  verifyOtp,
  login,
};
