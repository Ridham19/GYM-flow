import mongoose from "mongoose";
import dotenv from "dotenv";
import { Machine } from "./models/machine.model.js";

dotenv.config();

const sampleMachines = [
    { name: "Treadmill X1", category: "Cardio" },
    { name: "Elliptical Runner", category: "Cardio" },
    { name: "Rowing Machine 3000", category: "Cardio" },
    { name: "Leg Press", category: "Strength" },
    { name: "Lat Pulldown", category: "Strength" },
    { name: "Chest Press", category: "Strength" },
    { name: "Smith Machine", category: "Strength" },
    { name: "Olympia Bench Press", category: "Weights" },
    { name: "Squat Rack", category: "Weights" },
    { name: "Dumbbell Set (5-50kg)", category: "Weights" },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing
        await Machine.deleteMany({});
        console.log("Cleared existing machines.");

        // Insert new
        await Machine.insertMany(sampleMachines);
        console.log("Added sample machines!");

        mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedDB();
