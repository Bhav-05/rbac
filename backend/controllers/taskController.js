const Task = require("../models/Task");
const logActivity = require("../utils/logger");

exports.createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });
    const task = await Task.create({ title, description, status, userId: req.user._id });
    await logActivity(req.user._id, "TASK_CREATED", "Created task: " + title);
    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { userId: req.user._id };
    const tasks = await Task.find(filter).populate("userId", "name email role");
    res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (req.user.role !== "admin" && task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after", runValidators: true }
    );
    await logActivity(req.user._id, "TASK_UPDATED", "Updated task: " + task.title);
    res.status(200).json({ success: true, task: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (req.user.role !== "admin" && task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this task" });
    }
    await Task.findByIdAndDelete(req.params.id);
    await logActivity(req.user._id, "TASK_DELETED", "Deleted task: " + task.title);
    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
