import { Trainer } from "../models/trainer.model.js";
import { User } from "../models/user.model.js";
import { Booking } from "../models/booking.model.js";
import { Review } from "../models/review.model.js";
import bcryptjs from "bcryptjs";

// Admin only
export async function createTrainer(req, res) {
    try {
        // 1. Create User account for Trainer
        const { username, email, password, name, specialization, bio, workingHours } = req.body;

        if (!username || !email || !password || !name) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: "trainer"
        });
        await newUser.save();

        // 2. Create Trainer Profile
        const newTrainer = new Trainer({
            user: newUser._id,
            name,
            specialization,
            bio,
            workingHours
        });
        await newTrainer.save();

        res.status(201).json({ success: true, trainer: newTrainer });
    } catch (error) {
        console.log("Error in createTrainer", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function getTrainers(req, res) {
    try {
        const trainers = await Trainer.find().populate("user", "username email");
        res.status(200).json({ success: true, trainers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function updateWorkingHours(req, res) {
    try {
        const { start, end } = req.body; // e.g., "09:00", "17:00"
        const trainer = await Trainer.findOne({ user: req.user._id });

        if (!trainer) return res.status(404).json({ success: false, message: "Trainer not found" });

        trainer.workingHours = { start, end };
        await trainer.save();

        res.status(200).json({ success: true, trainer });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function deletedTrainer(req, res) {
    try {
        const { id } = req.params;
        const trainer = await Trainer.findById(id);
        if (!trainer) return res.status(404).json({ success: false, message: "Trainer not found" });

        // Delete associated User
        await User.findByIdAndDelete(trainer.user);
        // Delete Trainer
        await Trainer.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Trainer deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// Stats for Admin
export async function getTrainerStats(req, res) {
    try {
        const trainers = await Trainer.find().lean();
        const stats = await Promise.all(trainers.map(async (trainer) => {
            const bookingCount = await Booking.countDocuments({ trainers: trainer._id });
            // Simple hours calculation could vary, keeping it simple count for now
            return {
                ...trainer,
                totalBookings: bookingCount
            };
        }));
        res.status(200).json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// Reviews
export async function addReview(req, res) {
    try {
        const { trainerId, rating, comment } = req.body;
        const newReview = new Review({
            trainer: trainerId,
            user: req.user._id,
            rating,
            comment
        });
        await newReview.save();
        res.status(201).json({ success: true, review: newReview });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function getReviews(req, res) {
    try {
        const { trainerId } = req.params;
        const reviews = await Review.find({ trainer: trainerId }).populate("user", "username");
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
