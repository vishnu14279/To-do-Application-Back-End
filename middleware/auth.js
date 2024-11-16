const jwt = require("jsonwebtoken");
const User = require("../Model/User");
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET
const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.header("authorization");
      if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ msg: "Authorization header is missing or improperly formatted" });
      }

      const token = authHeader.replace("Bearer ", "");
      let decoded;

      try {
        decoded = jwt.verify(token, jwtSecret);
      } catch (err) {
        return res.status(401).json({ msg: "Token is not valid or has expired" });
      }

      req.user = await User.findById(decoded.id);
      if (!req.user || (roles.length && !roles.includes(req.user.role))) {
        return res.status(403).json({ msg: "Access Denied" });
      }

      next();
    } catch (err) {
      console.error("Authentication error:", err);
      res.status(500).json({ msg: "An internal server error occurred" });
    }
  };
};

module.exports = auth;
