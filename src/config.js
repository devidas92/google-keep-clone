require("dotenv").config({ path: __dirname + "/.env" });
const config = {
  environment: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "user",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "mydatabase",
  },
  api: {
    key: process.env.API_KEY || "your_api_key_here",
  },
  jwt: {
    secret_key: process.env.SECRET_KEY || "secret",
  },
};
module.exports = config;
