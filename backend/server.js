import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import gymRoutes from "./routes/gym.route.js";
import trainerRoutes from "./routes/trainer.route.js";
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";


dotenv.config();
const app = express();


app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

app.use(express.json()); // allows us to parse req.body
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);
app.use(cookieParser());
app.use("/api/v1/gym", gymRoutes);
app.use("/api/v1/trainers", trainerRoutes);

app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
    console.log("Server started at http://localhost:" + PORT);
    connectDB();
});


import { Machine } from "./models/machine.model.js";
const seedMachines = async () => {
    const count = await Machine.countDocuments();
    if (count === 0) {
        await Machine.insertMany([
            { name: "Treadmill 01", category: "Cardio" },
            { name: "Leg Press Max", category: "Strength" },
            { name: "Bench Press 1", category: "Weights" },
            { name: "Elliptical 05", category: "Cardio" }
        ]);
        console.log("Database Seeded with Machines!");
    }
};



// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Move up one level to root, then into frontend/dist
const buildPath = path.join(__dirname, "../frontend/dist");

if (process.env.NODE_ENV === "production") {
    app.use(express.static(buildPath));
    app.get("*", (req, res) => {
        res.sendFile(path.join(buildPath, "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("Server is running... Please use the Frontend Dev Server");
    });
}

