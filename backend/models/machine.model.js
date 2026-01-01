import mongoose from "mongoose";

const machineSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
		enum: ["Cardio", "Strength", "Weights"], // Restricts types to these three
	},
});

export const Machine = mongoose.model("Machine", machineSchema);