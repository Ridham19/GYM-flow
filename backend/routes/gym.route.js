// backend/routes/gym.route.js
import express from "express";
import { createReservation, getMachines, addMachine, deleteMachine } from "../controllers/gym.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/machines", getMachines);
router.post("/reserve", protectRoute, createReservation);

// Admin only routes
router.post("/admin/add", protectRoute, async (req, res, next) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Admin access denied" });
    next();
}, addMachine);

router.delete("/admin/:id", protectRoute, async (req, res, next) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Admin access denied" });
    next();
}, deleteMachine);

export default router;