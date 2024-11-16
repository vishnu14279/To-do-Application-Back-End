const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const http = require('http'); // Import http
const ActivityLog = require("./Model/ActivityLog")
dotenv.config({
  path: './.env'
});

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION!!! shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});
const database = process.env.DATABASE

mongoose.connect(database).then(con => {
  console.log('DB connection Successfully!');
});
io.on("connection", (socket) => {
  socket.on("taskCreated", (task) => {
    io.emit("taskCreated", task);
    const notification = {
      timestamp: new Date(),
      userId: task.assignedUser,
    };
    io.emit("newNotification", notification);
  });
  socket.on("get-activity-logs", async () => {
    try {
      const logs = await ActivityLog.find();
      socket.emit("activity-logs", logs);
    } catch (err) {
      console.error("Error fetching activity logs:", err);
    }
  });

  socket.on("taskUpdated", (task) => {
    io.emit("taskUpdated", task);
    const notification = {
      timestamp: new Date(),
      userId: task.assignedUser,
    };
    io.emit("newNotification", notification);
  });
  socket.on("taskDeleted", (task) => {
    io.emit("taskDeleted", task);
  });

});
const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Application is running on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION!!!  shutting down ...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});