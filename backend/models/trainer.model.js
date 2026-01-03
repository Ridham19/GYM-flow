import mongoose from "mongoose";

const trainerSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    specialization: { type: String, default: "" },
    bio: { type: String, default: "" },
    yearsExperience: { type: Number, default: 0 },
    workingHours: {
        start: { type: String, default: "09:00" },
        end: { type: String, default: "17:00" }
    },
    profileImage: { type: String, default: "" }
}, { timestamps: true });

export const Trainer = mongoose.model("Trainer", trainerSchema);
