// lib imports
import { Router } from "express";

// server imports
import {
  addClassroom,
  addStudentToClassroom,
  fetchClassroom,
  fetchClassroomAssignments,
  modifyClassroom,
  removeClassroom,
} from "../services/classrooms.js";

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
router.get("/:id", verifyJWT, fetchClassroom); // both
router.get("/:id/assignments", verifyJWT, fetchClassroomAssignments); // both
router.post("/", verifyJWT, verifyTeacher, addClassroom); // only teacher
router.patch("/:id", verifyJWT, verifyTeacher, modifyClassroom); // only teacher
router.delete("/:id", verifyJWT, verifyTeacher, removeClassroom); // only teacher
router.patch("/:id/students", verifyJWT, verifyTeacher, addStudentToClassroom); // only teachers

export default router;
