// utils/sendNotificationToUser.js
const Notification = require('../models/Notification');

async function sendNotificationToUser(app, userId, payload) {
  const io = app.get("io");
  const userSockets = app.get("userSockets");
  const socketId = userSockets?.get(userId.toString());

  // Log notification to DB
  const notification = new Notification({
    userId,
    message: payload.message,
    type: payload.type,
    taskId: payload.taskId,
  });

  await notification.save();

  // Emit socket message if user is connected
  if (socketId) {
    io.to(socketId).emit("notification", payload);
    return true;
  }
  return false;
}

module.exports = sendNotificationToUser;
