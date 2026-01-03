import { Machine } from "../models/machine.model.js";
import { Booking } from "../models/booking.model.js";
import { Trainer } from "../models/trainer.model.js";

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
		// Changed to trainerIds array
		const { trainerIds, startTime, endTime } = req.body;

		if (!trainerIds || trainerIds.length === 0) {
			return res.status(400).json({ success: false, message: "Select at least one trainer" });
		}

		const start = new Date(startTime);
		const end = new Date(endTime);
		const startHour = start.getHours();

		// 1. Validate Working Hours for ALL selected trainers
		// We need to fetch trainers first to check their specific working hours
		// For simplicity/performance, assume we might need to do a DB call here or just check basic range constraint if generic.
		// But user requirement: "time user selects should be in the trainers working hour"
		// Detailed check:
		const trainers = await Trainer.find({ _id: { $in: trainerIds } });

		for (const trainer of trainers) {
			const tStart = parseInt(trainer.workingHours.start.split(':')[0]);
			const tEnd = parseInt(trainer.workingHours.end.split(':')[0]); // e.g., 17 means 5pm

			if (startHour < tStart || startHour >= tEnd) {
				return res.status(400).json({ success: false, message: `${trainer.name} is not working at this time (${trainer.workingHours.start} - ${trainer.workingHours.end})` });
			}
		}

		// 2. Conflict Check
		const existingBooking = await Booking.findOne({
			trainers: { $in: trainerIds }, // Check if ANY of these trainers are booked
			$or: [
				{ startTime: { $lt: endTime, $gte: startTime } },
				{ endTime: { $gt: startTime, $lte: endTime } },
			],
		});

		if (existingBooking) {
			return res.status(400).json({ success: false, message: "One or more trainers are already booked for this time." });
		}

		const newBooking = new Booking({
			user: req.user._id,
			trainers: trainerIds,
			startTime,
			endTime,
		});

		await newBooking.save();
		res.status(201).json({ success: true, booking: newBooking });
	} catch (error) {
		console.log("Error in createReservation", error.message)
		res.status(500).json({ success: false, message: "Server Error" });
	}
}

export async function getMachineBookings(req, res) {
	try {
		const { machineId } = req.params;
		const { date } = req.query; // Expects ISO string or YYYY-MM-DD

		const startOfDay = new Date(date);
		startOfDay.setHours(0, 0, 0, 0);

		const endOfDay = new Date(date);
		endOfDay.setHours(23, 59, 59, 999);

		const bookings = await Booking.find({
			machine: machineId,
			startTime: { $gte: startOfDay, $lte: endOfDay }
		}).select("startTime endTime");

		res.status(200).json({ success: true, bookings });
	} catch (error) {
		res.status(500).json({ success: false, message: "Failed to fetch bookings" });
	}
}

export async function addMachine(req, res) {
	try {
		const { name, category } = req.body;
		if (!name) return res.status(400).json({ success: false, message: "Name is required" });

		const newMachine = new Machine({ name, category });
		await newMachine.save();
		res.status(201).json({ success: true, machine: newMachine });
	} catch (error) {
		console.log("Error in addMachine controller", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function deleteMachine(req, res) {
	try {
		const { id } = req.params;
		await Machine.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Machine deleted successfully" });
	} catch (error) {
		console.log("Error in deleteMachine controller", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getLiveBookings(req, res) {
	try {
		const bookings = await Booking.find({})
			.populate('user', 'username email')
			.populate('trainers', 'name specialization')
			.sort({ startTime: -1 });

		res.status(200).json({ success: true, bookings });
	} catch (error) {
		console.log("Error in getLiveBookings controller", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}
