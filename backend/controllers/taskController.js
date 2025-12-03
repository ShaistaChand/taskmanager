import Task from "../models/Task.js";
// import Activity from "../models/Activity.js";

// Create Task (Manager only)
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo,
      createdBy: req.user.id,
    });

    // Log activity
    await Activity.create({
      taskId: task._id,
      updatedBy: req.user.id,
      message: `Task created by ${req.user.id}`,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all tasks (manager) or user's tasks (user)
export const getTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "manager") {
      tasks = await Task.find().populate("assignedTo createdBy", "name email");
    } else {
      tasks = await Task.find({ assignedTo: req.user.id }).populate(
        "createdBy",
        "name email"
      );
    }

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Task (Manager only)
export const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // Activity log
    await Activity.create({
      taskId: req.params.id,
      updatedBy: req.user.id,
      message: `Task updated by ${req.user.id}`,
    });

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Task (Manager only)
export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    // Log
    await Activity.create({
      taskId: req.params.id,
      updatedBy: req.user.id,
      message: `Task deleted by ${req.user.id}`,
    });

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User: Update only task status
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      assignedTo: req.user.id,
    });

    if (!task) return res.status(403).json({ message: "Not allowed" });

    task.status = status;
    await task.save();

    await Activity.create({
      taskId: task._id,
      updatedBy: req.user.id,
      message: `Status updated to "${status}"`,
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
