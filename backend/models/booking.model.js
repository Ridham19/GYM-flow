import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	machine: { type: mongoose.Schema.Types.ObjectId, ref: "Machine", required: true },
	startTime: { type: Date, required: true },
	endTime: { type: Date, required: true },
});

export const Booking = mongoose.model("Booking", bookingSchema);