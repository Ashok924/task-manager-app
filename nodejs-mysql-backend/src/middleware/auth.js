import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * Generate JWT token for user
 * @param {number} userId - User ID
 * @param {string} email - User email
 * @returns {string} JWT token
 */
export function generateToken(userId, email) {
    return jwt.sign({ userId, email }, SECRET, { expiresIn: "7d" });
}

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {object|null} Decoded token or null if invalid
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET);
    } catch (error) {
        return null;
    }
}

/**
 * Middleware to authenticate JWT token
 */
export function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access token required" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }

    req.user = decoded;
    next();
}
