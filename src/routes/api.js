// Lib
import { Router } from "express";

// server imports
import authRoutes from "./auth.js";
import assignmentsRoutes from "./assignments.js";
import classroomsRoutes from "./classrooms.js";
import userRoutes from "./users.js";
import studentAssignmentSubmissionRoutes from "./studentAssignmentSubmissions.js";

const router = Router();

router.get("/", async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Student Assignment APIs!",
  });
});

// sub routers
router.use("/auth", authRoutes);
router.use("/assignments", assignmentsRoutes);
router.use("/classrooms", classroomsRoutes);
router.use("/users", userRoutes);
router.use("/submissions", studentAssignmentSubmissionRoutes);

export default router;
