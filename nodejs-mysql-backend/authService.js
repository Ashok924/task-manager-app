import bcrypt from "bcryptjs";
import pool from "./db.js";
import { generateToken } from "./auth.js";

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

export async function login(email, password) {
  try {
    const [[user]] = await pool.execute(
      "SELECT id, email, name, password FROM users WHERE email = ?",
      [email]
    );

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
