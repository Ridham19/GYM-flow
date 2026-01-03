import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./backend/models/user.model.js";
import { Trainer } from "./backend/models/trainer.model.js";
import { Booking } from "./backend/models/booking.model.js";
import bcrypt from "bcryptjs";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Error connection to MongoDB:", error.message);
        process.exit(1);
    }
};

const populate = async () => {
    await connectDB();

    try {
        // 1. Create Users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("123456", salt);

        const alice = await User.findOneAndUpdate(
            { email: "alice@test.com" },
            { username: "alice", email: "alice@test.com", password: hashedPassword, role: "user" },
            { upsert: true, new: true }
        );
        console.log("Alice created");

        const bob = await User.findOneAndUpdate(
            { email: "bob@test.com" },
            { username: "bob", email: "bob@test.com", password: hashedPassword, role: "user" },
            { upsert: true, new: true }
        );
        console.log("Bob created");

        // 2. Ensure Trainers
        // Sarah (Yoga)
        let sarah = await Trainer.findOne({ name: "Sarah Yoga" });
        if (!sarah) {
            // Check if browsing created her user? Probably not linked well if UI failed or was partial
            // Just create/link a user for her
            const sarahUser = await User.findOneAndUpdate(
                { email: "sarah@gym.com" },
                { username: "sarah", email: "sarah@gym.com", password: hashedPassword, role: "trainer" },
                { upsert: true, new: true }
            );

            sarah = await Trainer.create({
                user: sarahUser._id,
                name: "Sarah Yoga",
                specialization: "Yoga",
                bio: "Expert in Hatha and Vinyasa.",
                yearsExperience: 5,
                workingHours: { start: "08:00", end: "16:00" }
            });
            console.log("Sarah Yoga created");
        } else {
            console.log("Sarah Yoga already exists");
        }

        // Mike (General) - assuming he exists, else create
        let mike = await Trainer.findOne({ name: { $regex: /Mike/i } });
        if (!mike) {
            const mikeUser = await User.findOneAndUpdate(
                { email: "mike@gym.com" },
                { username: "mike", email: "mike@gym.com", password: hashedPassword, role: "trainer" },
                { upsert: true, new: true }
            );
            mike = await Trainer.create({
                user: mikeUser._id,
                name: "Mike Trainer",
                specialization: "General Fitness",
                workingHours: { start: "09:00", end: "17:00" }
            });
            console.log("Mike created");
        }

        // 3. Create Bookings
        const today = new Date().toISOString().split('T')[0];

        // Alice -> Sarah (09:00 - 10:00)
        await Booking.create({
            user: alice._id,
            trainers: [sarah._id],
            startTime: new Date(`${today}T09:00:00.000Z`), // UTC handling might be tricky but okay for demo
            endTime: new Date(`${today}T10:00:00.000Z`)
        });
        console.log("Booking: Alice -> Sarah");

        // Bob -> Mike (13:00 - 14:00)
        await Booking.create({
            user: bob._id,
            trainers: [mike._id],
            startTime: new Date(`${today}T13:00:00.000Z`),
            endTime: new Date(`${today}T14:00:00.000Z`)
        });
        console.log("Booking: Bob -> Mike");


        console.log("Data Population Complete!");
        process.exit(0);

    } catch (error) {
        console.error("Population Error:", error);
        process.exit(1);
    }
};

populate();
