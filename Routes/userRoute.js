// routes/auth.js
const express = require("express");
const router = express.Router();
const { fetchUser,getAllUsers } = require("../Controller/userController");

router.get("/fetchUser/:id", fetchUser);
router.get("/all", getAllUsers);



module.exports = router;
