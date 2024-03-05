// lib imports
import { Router } from "express";

// server imports
import {
  addAssignment,
  fetchAssignment,
  modifyAssignment,
  removeAssignment,
  fetchAllAssignments,
} from "../services/assignments.js";

import { verifyJWT, verifyTeacher } from "../middlewares/auth.js";

// Router
const router = Router();

// Path Identifier
router.get("/", async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Assignment APIs!",
  });
});

// Sub routes
router.get("/all", verifyJWT, verifyTeacher, fetchAllAssignments); // only teacher
router.get("/:id", verifyJWT, fetchAssignment); // both
router.post("/", verifyJWT, verifyTeacher, addAssignment); // only teacher
router.patch("/:id", verifyJWT, verifyTeacher, modifyAssignment); // only teacher
router.delete("/:id", verifyJWT, verifyTeacher, removeAssignment); // only teacher

export default router;
