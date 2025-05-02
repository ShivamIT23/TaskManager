const express = require('express');
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');
const roleCheck = require('../middlewares/roleCheck');
const router = express.Router();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.sendStatus(401);
  }
};

router.use(auth);

router.post('/', async (req, res) => {
    const { assignedTo } = req.body;
  
    // Check if the assigned user exists
    const user = await User.findById(assignedTo); // Assuming User model has role field
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
  
    // Check if the assigned user has a lower role than the person assigning the task
    if (req.user.role === 'admin') {
      // Admin can assign to anyone (manager or user)
    } else if (req.user.role === 'manager') {
      // Manager can only assign tasks to users, not other managers
      if (user.role !== 'user') {
        return res.status(403).json({ message: "Managers can only assign tasks to users" });
      }
    } else {
      return res.status(403).json({ message: "You don't have permission to assign tasks" });
    }
  
    // Create and save the task
    const task = new Task({ ...req.body, createdBy: req.user.userId });
    await task.save();
    res.status(201).json(task);
  });

router.get('/', async (req, res) => {
  try{
    const tasks = await Task.find({
    $or: [
      { createdBy: req.user.userId },
      { assignedTo: req.user.userId }
    ]
  });
  res.json(tasks);
}catch(err){
    console.log("Error on db parts")
}
});

router.put('/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

module.exports = router;