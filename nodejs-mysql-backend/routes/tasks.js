import express from "express";
import { authenticateToken } from "../auth.js";
import {
  createTask,
  getUserTasks,
  updateTask,
  deleteTask,
  toggleTask,
} from "../taskService.js";

const router = express.Router();

// Protect all task routes with authentication
router.use(authenticateToken);

router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.userId;

    if (!title) {
      return res.status(400).json({ error: "Title required" });
    }

    const task = await createTask(userId, title, description || "");
    res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const userId = req.user.userId;
    const tasks = await getUserTasks(userId);
    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const userId = req.user.userId;

    if (!title) {
      return res.status(400).json({ error: "Title required" });
    }

    const result = await updateTask(id, userId, title, description || "", completed || false);
    res.json(result);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await deleteTask(id, userId);
    res.json(result);
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await toggleTask(id, userId);
    res.json(result);
  } catch (error) {
    console.error("Toggle task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
