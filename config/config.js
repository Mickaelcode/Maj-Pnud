require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "chrysler0862",
    database: process.env.DB_DATABASE || "recette",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgresql",
  },
  test: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "chrysler0862",
    database: process.env.DB_DATABASE || "recette",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgresql",
  },
  production: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "chrysler0862",
    database: process.env.DB_DATABASE || "recette",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgresql",
  },
};