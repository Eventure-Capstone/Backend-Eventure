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

const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!user) {
    throw new ResponseError(404, "User tidak ditemukan");
  }

  return user;
}

const updateUser = async (id, fullName, email, password) => {
  const userId = id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ResponseError(404, "User tidak ditemukan");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: userId },
    data: {
      fullName,
      email,
      password: passwordHash,
    },
  });
};

const deleteUser = async (id) => {
  const userId = id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ResponseError(404, "User tidak ditemukan");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

}

const createEvent = async (event_name, author, category, description, location, date, time) => {
  //TODO: Bikin fungsi buat ambil date dari body berbentuk string menjadi sesuai format datetime

  const event = await prisma.event.create({
    data: {
      event_name,
      author,
      category,
      description,
      location,
      date,
      time,
    },
  });
  return event;
}; 

export default {
  register,
  verifyOtp,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createEvent,
};
