// config/authConfig.js
require("dotenv").config(); // Ensure .env is loaded

const crypto = require("crypto");
const secretkey =  crypto.randomBytes(64).toString("hex");
// If JWT_SECRET is not set in the .env file, generate a new one dynamically
const jwtSecret = process.env.JWT_SECRET 
console.log(secretkey,"newkey");
module.exports = {
  secret: jwtSecret,  // Use the JWT_SECRET from .env or a dynamically generated one
  tokenExpiration: "1h",  // Token expiration time
};
