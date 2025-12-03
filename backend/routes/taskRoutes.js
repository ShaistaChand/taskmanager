//api endpoints file

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { managerOnly } from "../middleware/roleMiddleware.js";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/", protect, managerOnly, createTask);
router.get("/", protect, getTasks);
router.put("/:id", protect, managerOnly, updateTask);
router.delete("/:id", protect, managerOnly, deleteTask);

// user updates only their own status
router.patch("/:id/status", protect, updateTaskStatus);

export default router;


