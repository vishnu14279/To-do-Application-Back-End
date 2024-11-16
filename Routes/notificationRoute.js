const express = require("express");
const { getNotifications, markNotificationAsRead } = require("../Controller/notificationController");

const router = express.Router();

router.get("/:userId", getNotifications);

router.patch('/:id', markNotificationAsRead);

module.exports = router;
