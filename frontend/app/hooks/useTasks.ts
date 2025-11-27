"use client";

import { useState, useEffect, useCallback } from "react";
import type { Task } from "../types/task";

export type AlertType = "success" | "error" | "info" | "warning";

interface AlertState {
  type: AlertType;
  message: string;
}

const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<AlertState | null>(null);

  // Fetch tasks from backend on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          const formattedTasks: Task[] = data.map((t: any) => ({
            id: String(t.id),
            title: t.title,
            completed: t.completed,
            createdAt: t.created_at,
          }));
          setTasks(formattedTasks);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setAlert({ type: "error", message: "Failed to load tasks. Please refresh the page." });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = useCallback(async (title: string) => {
    if (!title.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: title.trim(), description: "" }),
      });

      if (response.ok) {
        const newTask = await response.json();
        const formattedTask: Task = {
          id: String(newTask.id),
          title: newTask.title,
          completed: newTask.completed,
          createdAt: new Date().toISOString(),
        };
        setTasks((prev) => [...prev, formattedTask]);
        setAlert({ type: "success", message: "Task added successfully!" });
      } else {
        setAlert({ type: "error", message: "Failed to add task. Please try again." });
      }
    } catch (error) {
      console.error("Failed to add task:", error);
      setAlert({ type: "error", message: "Failed to add task. Please check your connection." });
    }
  }, []);

  const toggleTask = useCallback(async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}/toggle`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          )
        );
        setAlert({ type: "success", message: "Task updated successfully!" });
      } else {
        setAlert({ type: "error", message: "Failed to update task. Please try again." });
      }
    } catch (error) {
      console.error("Failed to toggle task:", error);
      setAlert({ type: "error", message: "Failed to update task. Please check your connection." });
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== id));
        setAlert({ type: "success", message: "Task deleted successfully!" });
      } else {
        setAlert({ type: "error", message: "Failed to delete task. Please try again." });
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      setAlert({ type: "error", message: "Failed to delete task. Please check your connection." });
    }
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    filter,
    setFilter,
    addTask,
    toggleTask,
    deleteTask,
    isLoading,
    alert,
    clearAlert: () => setAlert(null),
  };
};

export default useTasks;

