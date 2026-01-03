import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
}, { timestamps: true });

export const Review = mongoose.model("Review", reviewSchema);
