// lib imports
import { Router } from "express";

// server imports
import {
  addUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  verifyUser,
  resendOtp,
} from "../services/auth.js";

import { verifyJWT } from "../middlewares/auth.js";

// Router
const router = Router();

// Path Identifier
router.get("/", async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Auth APIs!",
  });
});

// Sub routes

// users
router.post("/register", addUser);
router.post("/login", loginUser);
router.get("/logout", verifyJWT, logoutUser);

// session
router.get("/refresh-token", refreshAccessToken);

// verify otp
router.post("/verify-otp/:email", verifyUser);
router.get("/resend-otp", verifyJWT, resendOtp);

export default router;
