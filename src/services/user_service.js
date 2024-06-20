import { validate } from "../validation/validation.js";
import { ResponseError } from "../exceptions/exceptions.js";
// import prisma from "../application/database.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendEmail } from "./email_service.js";
import { db, config } from "../config/config.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const OTP_EXPIRATION_MINUTES = 30;

const register = async (full_name, email, password) => {
  const password_hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      full_name,
      email,
      password: password_hash,
    },
  });

  const otp_code = generate_otp();
  const expires_at = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60 * 1000);
  await prisma.emailVerification.create({
    data: {
      otp_code,
      expires_at,
      user_id: user.id,
    },
  });

  await sendEmail(email, `Your OTP code is: ${otp_code}`);
  return user;
};

const verify_otp = async (email, otp_code) => {
  console.log(otp_code);
  const user = await prisma.user.findUnique({
    where: { email },
    include: { email_verifications: true },
  });

  if (!user) throw new Error("User not found");

  const email_verification = user.email_verifications.find(
    (ev) =>
      ev.otp_code === otp_code && !ev.is_used && ev.expires_at > new Date()
  );

  if (!email_verification) throw new Error("Invalid or expired OTP");

  await prisma.user.update({
    where: { id: user.id },
    data: { is_active: true },
  });

  await prisma.emailVerification.update({
    where: { id: email_verification.id },
    data: { is_used: true },
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

  const is_password_valid = await bcrypt.compare(password, user.password);
  if (!is_password_valid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { id: user.id, is_active: user.is_active },
    config.jwt_secret,
    {
      expiresIn: config.jwt_expiration,
    }
  );

  return token;
};

const generate_otp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};


const getUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
      include: {
        preferences: true,
        events: true,
        saved_events: true,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(`Error retrieving user: ${error.message}`);
  }
};

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
};

const createEvent = async (
  event_name,
  author,
  category,
  description,
  location,
  date,
  time
) => {
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
  verify_otp,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createEvent,
};
