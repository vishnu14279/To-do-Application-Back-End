// routes/tasks.js
const express = require("express");
const auth = require("../middleware/auth");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../Controller/taskController");

const router = express.Router();

router.post("/", auth(["Admin", "User"]), createTask);
router.get("/", auth(["Admin", "User"]), getTasks);
router.put("/updateTask/:id", auth(["Admin", "User"]), updateTask);
router.delete("/deleteTask/:id/:userid", auth(["Admin","User"]), deleteTask);

module.exports = router;
