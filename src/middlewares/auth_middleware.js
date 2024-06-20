import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, config.jwt_secret, (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Token is not valid",
          data: [],
        });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Authorization header missing",
      data: [],
    });
  }
};
