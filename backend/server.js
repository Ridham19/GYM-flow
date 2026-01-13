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

const app = express();
app.set('trust proxy', 1); // Add this line here

// const app = express();
const PORT = ENV_VARS.PORT;

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

const __dirname = path.resolve();

if (ENV_VARS.NODE_ENV === "production") {
    // Serve the static files from the frontend/dist folder
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    // For any other route, serve the index.html file
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
} else {
    // Basic route for development if you hit port 5000 directly
    app.get("/", (req, res) => {
        res.send("Server is running... Please use the Frontend Dev Server (port 5173)");
    });
}