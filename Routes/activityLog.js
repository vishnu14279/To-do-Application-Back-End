const express = require("express");
const router = express.Router();
const { getActivityLogs } = require("../Controller/activityController");

// Get all activity logs
router.get("/", getActivityLogs);

module.exports = router;
