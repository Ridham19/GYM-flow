import { Machine } from "../models/machine.model.js";
import { Booking } from "../models/booking.model.js";

export async function getMachines(req, res) {
	try {
		const machines = await Machine.find({});
		res.status(200).json({ success: true, machines });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function createReservation(req, res) {
	try {
		const { machineId, startTime, endTime } = req.body;

		// 1. Conflict Check
		const existingBooking = await Booking.findOne({
			machine: machineId,
			$or: [
				{ startTime: { $lt: endTime, $gte: startTime } },
				{ endTime: { $gt: startTime, $lte: endTime } },
			],
		});

		if (existingBooking) {
			return res.status(400).json({ success: false, message: "Machine already reserved for this time." });
		}

		const newBooking = new Booking({
			user: req.user._id,
			machine: machineId,
			startTime,
			endTime,
		});

		await newBooking.save();
		res.status(201).json({ success: true, booking: newBooking });
	} catch (error) {
		res.status(500).json({ success: false, message: "Server Error" });
	}
}
