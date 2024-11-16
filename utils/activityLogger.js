// utils/activityLogger.js
const ActivityLog = require("../Model/ActivityLog");

const logActivity = async (title,userId, action, taskId, description,status,username) => {
  try {
    await ActivityLog.create({
      title,
      userId,
      action,
      taskId,
      description,
      status,
      username
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};

module.exports = logActivity;
