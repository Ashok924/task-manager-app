import bcrypt from "bcryptjs";
import pool from "../config/database.js";
import { generateToken } from "../middleware/auth.js";

/**
 * Register a new user
 * @param {string} email - User email
 * @param {string} name - User name
 * @param {string} password - User password
 * @returns {Promise<object>} Registration result
 */
export async function signup(email, name, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.execute(
            "INSERT INTO users (email, name, password) VALUES (?, ?, ?)",
            [email, name, hashedPassword]
        );

        const userId = result.insertId;
        const token = generateToken(userId, email);

        return { success: true, userId, email, name, token };
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return { success: false, error: "Email already exists" };
        }
        throw error;
    }
}

/**
 * Authenticate user login
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} Login result
 */
export async function login(email, password) {
    try {
        const [rows] = await pool.execute(
            "SELECT id, email, name, password FROM users WHERE email = ?",
            [email]
        );

        const user = rows[0];

        if (!user) {
            return { success: false, error: "Invalid email or password" };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return { success: false, error: "Invalid email or password" };
        }

        const token = generateToken(user.id, user.email);
        return { success: true, userId: user.id, email: user.email, name: user.name, token };
    } catch (error) {
        throw error;
    }
}
