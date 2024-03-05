import { Router } from "express";
import apiRoutes from "./api.js";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Classroom Assignment APIs!",
  });
});

// sub routers
router.use("/api/v1", apiRoutes);

export default router;
