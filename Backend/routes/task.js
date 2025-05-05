const express = require("express");
const Task = require("../models/Task");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const sendNotificationToUser = require("../utils/sendNotificationToUser");
const Notification = require("../models/Notification");

const router = express.Router();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.sendStatus(401);
  }
};

router.use(auth);

// Create task
router.post("/", async (req, res) => {
  const { assignedToName } = req.body;
  const user = await User.findOne({ username: assignedToName });
  if (!user) return res.status(400).json({ message: "User not found" });

  const me = await User.findById(req.user.userId);

  if (req.user.role === "manager" && user.role !== "user") {
    return res
      .status(403)
      .json({ message: "Managers can only assign tasks to users" });
  } else if (!["admin", "manager"].includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: "You don't have permission to assign tasks" });
  }

  const task = new Task({
    ...req.body,
    createdByName: me.username,
    createdBy: req.user.userId,
    assignedToName: user.username,
    assignedTo: user._id,
  });
  await task.save();

  // Notify both creator and assignee
  sendNotificationToUser(req.app, req.user.userId, {
    type: "task-created",
    taskId: task._id,
    message: `Task "${task.title}" has been assigned to you.`,
  });
  sendNotificationToUser(req.app, user._id, {
    type: "task-created",
    taskId: task._id,
    message: `You have been assigned task "${task.title}" by ${req.user.userId}.`,
  });

  res.status(201).json(task);
});

router.get("/assigned-to-me", async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.userId });
    if (!tasks.length) {
      return res.status(404).json({ message: "No tasks assigned to you" });
    }
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/assigned-by-me", async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.userId });
    if (!tasks.length) {
      return res
        .status(404)
        .json({ message: "You haven't assigned any tasks yet" });
    }
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Request update
router.put("/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  const isCreator = task.createdBy.toString() === req.user.userId;
  const isAssignee = task.assignedTo.toString() === req.user.userId;
  if (!isCreator && !isAssignee) return res.sendStatus(403);

  // Mark for approval
  task.pendingAction = {
    type: "update",
    changes: req.body,
    requestedBy: req.user.userId,
    approvedBy: [],
  };
  await task.save();

  const targetId = isCreator ? task.assignedTo : task.createdBy;
  const fromId = req.user.userId;

  sendNotificationToUser(req.app, targetId, {
    type: "update-request",
    taskId: task._id,
    message: `${fromId} wants to update task "${task.title}"`,
  });

  const targetUser = await User.findById(targetId);
  const senderUser = await User.findById(fromId);

  await sendEmail(
    targetUser.email,
    senderUser,
    "Task Update Approval Needed",
    `<p>${fromId} has requested to update task <b>${task.title}</b>. Please log in to approve.</p>`
  );

  res.json({ message: "Update request sent for approval" });
});

// Reject update request
router.post("/:id/reject-update", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task || !task.pendingAction || task.pendingAction.type !== "update") {
    return res.status(400).json({ message: "No update request pending" });
  }

  const targetId =
    task.createdBy.toString() === req.user.userId
      ? task.assignedTo
      : task.createdBy;

  task.pendingAction = undefined;
  await task.save();

  sendNotificationToUser(req.app, targetId, {
    type: "update-rejected",
    taskId: task._id,
    message: `${req.user.userId} has rejected the update request for task "${task.title}".`,
  });

  res.json({ message: "Update request rejected" });
});

// Request delete
router.delete("/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  const isCreator = task.createdBy.toString() === req.user.userId;
  const isAssignee = task.assignedTo.toString() === req.user.userId;
  if (!isCreator && !isAssignee) return res.sendStatus(403);

  task.pendingAction = {
    type: "delete",
    requestedBy: req.user.userId,
    approvedBy: [],
  };
  await task.save();

  const targetId = isCreator ? task.assignedTo : task.createdBy;

  sendNotificationToUser(req.app, targetId, {
    type: "delete-request",
    taskId: task._id,
    message: `${req.user.userId} wants to delete task "${task.title}"`,
  });

  const targetUser = await User.findById(targetId);
  await sendEmail(
    targetUser.email,
    "Task Deletion Approval Needed",
    `<p>${req.user.userId} has requested to delete task <b>${task.title}</b>. Please log in to approve.</p>`
  );

  res.json({ message: "Delete request sent for approval" });
});

// Reject delete request
router.post("/:id/reject-delete", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task || !task.pendingAction || task.pendingAction.type !== "delete") {
    return res.status(400).json({ message: "No delete request pending" });
  }

  const targetId =
    task.createdBy.toString() === req.user.userId
      ? task.assignedTo
      : task.createdBy;

  task.pendingAction = undefined;
  await task.save();

  sendNotificationToUser(req.app, targetId, {
    type: "delete-rejected",
    taskId: task._id,
    message: `${req.user.userId} has rejected the delete request for task "${task.title}".`,
  });

  res.json({ message: "Delete request rejected" });
});

// Approve pending action
router.post("/:id/approve", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task || !task.pendingAction || !task.pendingAction.type) {
    return res.status(400).json({ message: "No pending action to approve" });
  }

  const { type: action, requestedBy, changes: updateData } = task.pendingAction;

  if (requestedBy.toString() === req.user.userId) {
    return res
      .status(403)
      .json({ message: "You cannot approve your own request" });
  }

  const isRelated =
    task.createdBy.toString() === req.user.userId ||
    task.assignedTo.toString() === req.user.userId;
  if (!isRelated) {
    return res
      .status(403)
      .json({ message: "You are not authorized to approve this task" });
  }

  // Optional: Prevent duplicate approvals
  if (task.pendingAction.approvedBy.includes(req.user.userId)) {
    return res
      .status(400)
      .json({ message: "You have already approved this request" });
  }
  task.pendingAction.approvedBy.push(req.user.userId);

  if (action === "update") {
    Object.assign(task, updateData);
    task.pendingAction = undefined;
    await task.save();

    sendNotificationToUser(req.app, requestedBy, {
      type: "update-approved",
      taskId: task._id,
      message: `Your update request for task "${task.title}" has been approved by ${req.user.userId}`,
    });

    return res.json({
      message: "Task updated successfully after approval",
      task,
    });
  }

  if (action === "delete") {
    await Task.findByIdAndDelete(task._id);

    sendNotificationToUser(req.app, requestedBy, {
      type: "delete-approved",
      taskId: task._id,
      message: `Your delete request for task "${task.title}" has been approved by ${req.user.userId}`,
    });

    return res.json({ message: "Task deleted successfully after approval" });
  }

  res.status(400).json({ message: "Invalid action type" });
});

module.exports = router;
