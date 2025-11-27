import express from "express";
import { signup, login } from "../authService.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ error: "Email, name, and password required" });
    }

    const result = await signup(email, name, password);
    res.json(result);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const result = await login(email, password);
    res.json(result);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

import { generateToken } from "../auth.js";
import passport from "../config/passport.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${FRONTEND_URL}/login?error=auth_failed` }),
  (req, res) => {
    const user = req.user;
    const token = generateToken(user.id, user.email, user.name);
    res.redirect(`${FRONTEND_URL}/?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&id=${user.id}`);
  }
);

router.get("/microsoft", passport.authenticate("microsoft", { scope: ["user.read"] }));

router.get(
  "/microsoft/callback",
  passport.authenticate("microsoft", { session: false, failureRedirect: `${FRONTEND_URL}/login?error=auth_failed` }),
  (req, res) => {
    const user = req.user;
    const token = generateToken(user.id, user.email, user.name);
    res.redirect(`${FRONTEND_URL}/?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&id=${user.id}`);
  }
);

export default router;
