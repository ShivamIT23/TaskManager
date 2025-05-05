// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    type: String, // 'update-request', 'delete-request', etc.
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
