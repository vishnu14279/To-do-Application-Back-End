const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  title:{type: String},
 userId: { type:  mongoose.Schema.Types.ObjectId, ref:"User", required: true },
 action: { type: String },
  taskId: { type: mongoose.Schema.Types.ObjectId },
  timestamp: { type: Date, default: Date.now },
  description: { type: String },
  status: { type: String },
  username:{type :String}
});

const activityLog = mongoose.model('activityLog', activityLogSchema, 'activityLog');

module.exports = activityLog;