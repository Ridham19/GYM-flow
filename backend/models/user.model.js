// backend/models/user.model.js
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: String, enum: ["user", "admin", "trainer"], default: "user" },
	isAdmin: { type: Boolean, default: false }, // Kept for backward compatibility, sync with role
	isApproved: { type: Boolean, default: false },
	paymentStatus: { type: String, enum: ["active", "overdue", "pending", "cancelled"], default: "pending" },
	nextPaymentDate: { type: Date, default: null },
});

export const User = mongoose.model("User", userSchema);