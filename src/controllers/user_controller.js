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
const get = async (req, res, next) => {};

const update = async (req, res, next) => {};

const logout = async (req, res, next) => {};

export default {
  register,
  verify,
  login,
  get,
  update,
  logout,
};
