// lib imports
import { Router } from "express";

// server imports
import {
  addStudentAssignmentSubmission,
  fetchStudentAssignmentSubmission,
  modifyStudentAssignmentSubmission,
  removeStudentAssignmentSubmission,
  addResults,
} from "../services/studentAssignmentSubmissions.js";

import {
  verifyJWT,
  verifyStudent,
  verifyTeacher,
} from "../middlewares/auth.js";

// Router
const router = Router();

// Path Identifier
router.get("/", async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Student Assignment Submission APIs!",
  });
});

// Sub routes
router.get("/:id", verifyJWT, fetchStudentAssignmentSubmission); // both
router.post("/", verifyJWT, verifyStudent, addStudentAssignmentSubmission); // only student
router.patch(
  "/:id",
  verifyJWT,
  verifyStudent,
  modifyStudentAssignmentSubmission
); // only student
router.delete(
  "/:id",
  verifyJWT,
  verifyStudent,
  removeStudentAssignmentSubmission
); // only student
router.post("/:id/results", verifyJWT, verifyTeacher, addResults);

export default router;
