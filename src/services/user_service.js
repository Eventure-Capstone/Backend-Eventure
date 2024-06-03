import { validate } from "../validation/validation.js";
import { ResponseError } from "../exceptions/exceptions.js";
import bcrypt from "bcrypt";
import { db, config } from "../config/database.js";

const register = async (body) => {
  const regis = ` insert into user (name, pass, phone) 
                  values ('${body.name}', '${body.pass}', '${body.phone}')`;
  return db.query(regis);
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
