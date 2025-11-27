import pool from "../config/database.js";

/**
 * Create a new task
 * @param {number} userId - User ID
 * @param {string} title - Task title
 * @param {string} description - Task description
 * @returns {Promise<object>} Created task
 */
export async function createTask(userId, title, description) {
    try {
        const [result] = await pool.execute(
            "INSERT INTO tasks (user_id, title, description, completed) VALUES (?, ?, ?, FALSE)",
            [userId, title, description]
        );

        return {
            id: result.insertId,
            user_id: userId,
            title,
            description,
            completed: false,
        };
    } catch (error) {
        throw error;
    }
}

/**
 * Get all tasks for a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of tasks
 */
export async function getUserTasks(userId) {
    try {
        const [tasks] = await pool.execute(
            "SELECT id, title, description, completed, created_at FROM tasks WHERE user_id = ? ORDER BY created_at DESC",
            [userId]
        );

        return tasks;
    } catch (error) {
        throw error;
    }
}

/**
 * Update a task
 * @param {number} taskId - Task ID
 * @param {number} userId - User ID
 * @param {string} title - Task title
 * @param {string} description - Task description
 * @param {boolean} completed - Task completion status
 * @returns {Promise<object>} Update result
 */
export async function updateTask(taskId, userId, title, description, completed) {
    try {
        const [result] = await pool.execute(
            "UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ? AND user_id = ?",
            [title, description, completed, taskId, userId]
        );

        if (result.affectedRows === 0) {
            return { success: false, error: "Task not found or unauthorized" };
        }

        return { success: true };
    } catch (error) {
        throw error;
    }
}

/**
 * Delete a task
 * @param {number} taskId - Task ID
 * @param {number} userId - User ID
 * @returns {Promise<object>} Delete result
 */
export async function deleteTask(taskId, userId) {
    try {
        const [result] = await pool.execute(
            "DELETE FROM tasks WHERE id = ? AND user_id = ?",
            [taskId, userId]
        );

        if (result.affectedRows === 0) {
            return { success: false, error: "Task not found or unauthorized" };
        }

        return { success: true };
    } catch (error) {
        throw error;
    }
}

/**
 * Toggle task completion status
 * @param {number} taskId - Task ID
 * @param {number} userId - User ID
 * @returns {Promise<object>} Toggle result
 */
export async function toggleTask(taskId, userId) {
    try {
        const [rows] = await pool.execute(
            "SELECT completed FROM tasks WHERE id = ? AND user_id = ?",
            [taskId, userId]
        );

        const task = rows[0];

        if (!task) {
            return { success: false, error: "Task not found or unauthorized" };
        }

        await pool.execute(
            "UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?",
            [!task.completed, taskId, userId]
        );

        return { success: true, completed: !task.completed };
    } catch (error) {
        throw error;
    }
}
