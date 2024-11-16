const Notification = require("../Model/Notification");

const createNotification = async (userId, taskId, message) => {
    try {
        const newNotification = new Notification({
            userId,
            taskId,
            message,
        });
        await newNotification.save();
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};
const getNotifications = async (req, res) => {
    const { userId } = req.params;

    try {
        const notifications = await Notification.find({ userId }).sort({ timestamp: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
};


const markNotificationAsRead = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the notification by ID and update its 'read' status
        const notification = await Notification.findByIdAndUpdate(
            id,
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification marked as read', notification });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { markNotificationAsRead };

module.exports = {
    createNotification,
    getNotifications,
    markNotificationAsRead,
};