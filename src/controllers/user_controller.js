import userServices from "../services/user_service.js";
import { ResponseError } from "../exceptions/exceptions.js";


const register = async (req, res, next) => {
  const { fullName, email, password } = req.body;
  try {
    const user = await userServices.register(fullName, email, password);
    res.json({
      message: "Registrasi berhasil",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  const { email, otpCode } = req.body;
  try {
    const user = await userServices.verifyOtp(email, otpCode);
    res.status(200).json({
      message: "Akun berhasil diverifikasi",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await userService.loginUser(email, password);
    res.status(200).json({
      status: "success",
      data: { token: token },
      message: "User logged in successfully",
    });
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userServices.getAllUsers();
    res.status(200).json({
      status: "success",
      data: users,
      message: "Data semua user berhasil didapatkan",
    });
  } catch (err) {
    next(err);
  }

};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, email, password } = req.body;

    await userServices.updateUser(id, fullName, email, password);
    res.status(200).json({
      status: "success",
      message: "User berhasil diupdate",
    });
  } catch (err) {
    console.log(req.params);
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userServices.getUserById(id);
    res.status(200).json({
      status: "success",
      data: user,
      message: "Data user berhasil didapatkan",
    });
  } catch (err) {
    next(err);
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userServices.deleteUser(id);
    res.status(200).json({
      status: "success",
      message: "User berhasil dihapus",
    });
  } catch (err) {
    next(err);
  }
}

const createEvent = async (req, res, next) => {
  try {
    const { event_name, author, category, description, location, date, time } = req.body;
    const event = await userServices.createEvent(event_name, author, category, description, location, date, time);
    res.status(201).json({
      status: "success",
      data: event,
      message: "Event berhasil dibuat",
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {};

export default {
  register,
  verify,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createEvent,
  logout,
};

