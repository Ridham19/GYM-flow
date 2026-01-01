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
			.populate('machine', 'name category')
			.sort({ startTime: -1 });

		res.status(200).json({ success: true, bookings });
	} catch (error) {
		console.log("Error in getLiveBookings controller", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}
