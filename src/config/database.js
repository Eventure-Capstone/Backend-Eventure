import mysql from "mysql";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dev_capstone",
});

const config = {
  jwtSecret: process.env.JWT_SECRET || "testjwt",
  jwtExpiration: process.env.JWT_EXPIRATION || "1h",
};
export { db, config };
