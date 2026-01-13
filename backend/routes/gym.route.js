// backend/routes/gym.route.js
import express from "express";
import { createReservation, getMachines, addMachine, deleteMachine, getMachineBookings, getLiveBookings, getMyBookings, cancelBooking, getUserManagement, approveUser, updatePayment } from "../controllers/gym.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/machines", getMachines);
router.get("/bookings/:machineId", protectRoute, getMachineBookings);
router.post("/reserve", protectRoute, createReservation);
router.get("/my-bookings", protectRoute, getMyBookings);
router.delete("/cancel/:id", protectRoute, cancelBooking);

// Admin only routes
router.get("/admin/users", protectRoute, async (req, res, next) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Admin access denied" });
    next();
}, getUserManagement);

router.put("/admin/approve-user/:id", protectRoute, async (req, res, next) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Admin access denied" });
    next();
}, approveUser);

router.put("/admin/approve-payment/:id", protectRoute, async (req, res, next) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Admin access denied" });
    next();
}, updatePayment);

router.post("/admin/add", protectRoute, async (req, res, next) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Admin access denied" });
    next();
}, addMachine);

router.get("/admin/bookings", protectRoute, async (req, res, next) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Admin access denied" });
    next();
}, getLiveBookings);

router.delete("/admin/:id", protectRoute, async (req, res, next) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Admin access denied" });
    next();
}, deleteMachine);

export default router;