import express from "express";
import { createTrainer, getTrainers, updateWorkingHours, deletedTrainer, getTrainerStats, addReview, getReviews } from "../controllers/trainer.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", getTrainers);
router.get("/reviews/:trainerId", getReviews);

// Protected routes
router.use(protectRoute);

router.post("/review", addReview);
router.put("/working-hours", updateWorkingHours); // Trainer only (validation inside controller or middleware needed ideally)

// Admin routes
router.post("/create", async (req, res, next) => {
    if (req.user.role !== "admin" && !req.user.isAdmin) return res.status(403).json({ message: "Access denied" });
    next();
}, createTrainer);

router.delete("/:id", async (req, res, next) => {
    if (req.user.role !== "admin" && !req.user.isAdmin) return res.status(403).json({ message: "Access denied" });
    next();
}, deletedTrainer);

router.get("/stats", async (req, res, next) => {
    if (req.user.role !== "admin" && !req.user.isAdmin) return res.status(403).json({ message: "Access denied" });
    next();
}, getTrainerStats);

export default router;
