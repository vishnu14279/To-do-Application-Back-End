const ActivityLog = require("../Model/ActivityLog");
const User = require("../Model/User");

const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate("userId", "username") 
      .populate("taskId", "title")   
      .sort({ timestamp: -1 })      
      .limit(20);                    
    console.log(logs)
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch activity logs" });
  }
};

module.exports = { getActivityLogs };
