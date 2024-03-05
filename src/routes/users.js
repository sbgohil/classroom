// lib imports
import { Router } from "express";

// server imports
import {
  fetchStudentAssignments,
  fetchUser,
  modifyUser,
  removeUser,
  fetchReports,
} from "../services/users.js";

import {
  verifyJWT,
  verifyStudent,
  verifyTeacher,
} from "../middlewares/auth.js";

// Router
const router = Router();

// Sub routes
router.get("/", verifyJWT, fetchUser); // for teachers
router.patch("/:id", verifyJWT, modifyUser);
router.delete("/:id", verifyJWT, removeUser);
router.get(
  "/:id/assignments",
  verifyJWT,
  verifyStudent,
  fetchStudentAssignments
); // for students
router.get("/:id/reports", verifyJWT, verifyTeacher, fetchReports);

export default router;
