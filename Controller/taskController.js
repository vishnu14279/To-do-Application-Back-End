const { default: mongoose } = require("mongoose");
const Task = require("../Model/Task");
const logActivity = require("../utils/activityLogger");
const { createNotification } = require("./notificationController");

const createTask = async (req, res) => {
  const { title, description, dueDate, status, assignedUser, privilegeId, userid, username } = req.body;

  if (!title || !dueDate) {
    return res.status(400).json({ error: "Title and Due Date are required." });
  }

  const newTask = new Task({ title, description, dueDate, status, assignedUser, privilegeId });
  await newTask.save();
  const userId = new mongoose.Types.ObjectId(userid);
  const taskId = newTask._id;
  const action = "created"
  await logActivity(title, userId, action, taskId, `Created task: ${newTask.title}`, newTask.status, username);
  const notificationMessage = `New task "${newTask.title}" assigned to you.`;
  await createNotification(assignedUser, taskId, notificationMessage);
  res.status(201).json(newTask);
};

const getTasks = async (req, res) => {
  const { status, dueDate, sortOrder = "asc" } = req.query;

  let filter = {};

  //  status filter
  if (status) {
    filter.status = status;
  }

  //  dueDate filter 
  if (dueDate) {
    const date = new Date(dueDate);
    filter.dueDate = { $gte: date };
  }

  try {
    const tasks = await Task.find(filter)
      .sort({ dueDate: sortOrder === "asc" ? 1 : -1 })
      .populate('assignedUser');
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

const updateTask = async (req, res) => {
  const { id: taskId } = req.params;
  const { title, description, dueDate, status, assignedUser, privilegeId, userid, username } = req.body;

  const task = await Task.findByIdAndUpdate(taskId, { title, description, dueDate, status, assignedUser, privilegeId }, { new: true });
  const userId = new mongoose.Types.ObjectId(userid);
  const action = "updated"
  await logActivity(task.title, userId, action, taskId, `Updated task: ${task.title}`, task.status, username);
  const notificationMessage = `Task "${task.title}" has been updated.`;
  await createNotification(assignedUser, taskId, notificationMessage);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.status(200).json(task);
};

const deleteTask = async (req, res) => {
  const { id: taskId, userid, username } = req.params;
  const task = await Task.findById(taskId);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  const userObjectId = new mongoose.Types.ObjectId(userid);
  const action = "deleted";
  await logActivity("deletedTask",userObjectId, action, taskId, `Deleted task: ${task.title}`, username);
  await Task.findByIdAndDelete(taskId);
  res.status(200).json({ message: "Task deleted successfully" });
};


module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};
