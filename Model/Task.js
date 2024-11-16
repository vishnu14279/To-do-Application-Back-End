const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ["To Do", "In Progress", "Done"], default: "To Do" },
  assignedUser: { type: mongoose.Schema.Types.ObjectId},
  privilegeId: { type: mongoose.Schema.Types.ObjectId},
});


const Task = mongoose.model('Task', TaskSchema, 'task');

module.exports = Task;
