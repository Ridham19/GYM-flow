// backend/models/user.model.js
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	isAdmin: { type: Boolean, default: false }, // New field
});

export const User = mongoose.model("User", userSchema);