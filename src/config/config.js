import mysql from "mysql";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dev_capstone",
});

const config = {
  jwt_secret: process.env.JWT_SECRET || "testjwt",
  jwt_expiration: process.env.JWT_EXPIRATION || "1h",
};
export { db, config };
