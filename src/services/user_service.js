import { validate } from "../validation/validation.js";
import { ResponseError } from "../exceptions/exceptions.js";
import bcrypt from "bcrypt";
import { db } from '../config/database.js'

const register = async (body) => {
  const regis = ` insert into user (name, pass, phone) 
                  values ('${body.name}', '${body.pass}', '${body.phone}')`;
  return db.query(regis);
};

const login = async () => {};

const get = async () => {};

const update = async () => {};

const logout = async () => {};

export default {
  register,
  login,
  get,
  update,
  logout,
};
