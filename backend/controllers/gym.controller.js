import { Machine } from "../models/machine.model.js";
import { Booking } from "../models/booking.model.js";
import { Trainer } from "../models/trainer.model.js";
import { User } from "../models/user.model.js";

export async function getMyBookings(req, res) {
	try {
		const bookings = await Booking.find({ user: req.user._id })
			.populate('trainers', 'name specialization')
			.sort({ startTime: 1 });
		res.status(200).json({ success: true, bookings });
	} catch (error) {
		console.log("Error in getMyBookings", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
}

export async function cancelBooking(req, res) {
	try {
		const { id } = req.params;
		const booking = await Booking.findById(id);

		if (!booking) {
			return res.status(404).json({ success: false, message: "Booking not found" });
		}

		if (booking.user.toString() !== req.user._id.toString()) {
			return res.status(403).json({ success: false, message: "Unauthorized to cancel this booking" });
		}

		await Booking.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Booking cancelled successfully" });
	} catch (error) {
		console.log("Error in cancelBooking", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
}

export async function getUserManagement(req, res) {
	try {
		const users = await User.find({ role: { $ne: 'admin' } }).select("-password");
		res.status(200).json({ success: true, users });
	} catch (error) {
		console.log("Error in getUserManagement", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
}

export async function approveUser(req, res) {
	try {
		const { id } = req.params;
		await User.findByIdAndUpdate(id, { isApproved: true });
		res.status(200).json({ success: true, message: "User approved successfully" });
	} catch (error) {
		console.log("Error in approveUser", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
}

export async function updatePayment(req, res) {
	try {
		const { id } = req.params;
		const { action, days } = req.body; // action: 'renew' | 'cancel'

		if (action === 'cancel') {
			await User.findByIdAndUpdate(id, {
				paymentStatus: 'cancelled',
				nextPaymentDate: null
			});
			return res.status(200).json({ success: true, message: "Membership cancelled" });
		}

		// Default to renew if no action or action is renew
		const renewalDays = days ? parseInt(days) : 30;
		const nextDate = new Date();
		nextDate.setDate(nextDate.getDate() + renewalDays);

		await User.findByIdAndUpdate(id, {
			paymentStatus: 'active',
			nextPaymentDate: nextDate
		});
		res.status(200).json({ success: true, message: `Membership renewed for ${renewalDays} days` });
	} catch (error) {
		console.log("Error in updatePayment", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
}

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

		// Duration check (limit to 2 hours)
		const durationHours = (end - start) / (1000 * 60 * 60);
		if (durationHours > 2) {
			return res.status(400).json({ success: false, message: "Reservation cannot exceed 2 hours" });
		}
		if (durationHours <= 0) {
			return res.status(400).json({ success: false, message: "Invalid time range" });
		}

		const startHour = start.getHours();

		// 1. Validate Working Hours for ALL selected trainers
		const trainers = await Trainer.find({ _id: { $in: trainerIds } });

		for (const trainer of trainers) {
			const tStart = parseInt(trainer.workingHours.start.split(':')[0]);
			const tEnd = parseInt(trainer.workingHours.end.split(':')[0]); // e.g., 17 means 5pm

			if (startHour < tStart || startHour >= tEnd) {
				return res.status(400).json({ success: false, message: `${trainer.name} is not working at this time (${trainer.workingHours.start} - ${trainer.workingHours.end})` });
			}
		}

		// 2. Conflict Check
		// Standard Overlap: (StartA < EndB) && (EndA > StartB)
		const existingBooking = await Booking.findOne({
			trainers: { $in: trainerIds },
			startTime: { $lt: endTime },
			endTime: { $gt: startTime }
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
