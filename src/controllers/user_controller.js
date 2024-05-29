import userServices from '../services/user_service.js';
import { ResponseError } from "../exceptions/exceptions.js";

const register = async (req, res) => {
  const {body} = req;
  try {
    await userServices.register(body);
    res.json({
      message: 'Registrasi berhasil',
      data: body
    })

  } catch (error){
    res.status(500).json({
      message: 'Server error',
      serverMessage: error,
    })
  }
};

const login = async (req, res, next) => {};

const get = async (req, res, next) => {};

const update = async (req, res, next) => {};

const logout = async (req, res, next) => {};

export default {
  register,
  login,
  get,
  update,
  logout,
};
