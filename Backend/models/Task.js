const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  priority: {
    type: String,
    enum: ["high", "medium", "low"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  createdByName: { type: mongoose.Schema.Types.String, ref: "User" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedToName: { type: mongoose.Schema.Types.String, ref: "User" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  pendingAction: {
    action: {
      type: String,
      enum: ["update", "delete"],
      default: null,
    },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updateData: { type: Object, default: null },
    approved: { type: Boolean, default: false },
  },
});

module.exports = mongoose.model("Task", TaskSchema);
