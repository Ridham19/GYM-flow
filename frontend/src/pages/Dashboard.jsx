import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Dumbbell, Calendar, Loader, Clock, Users } from "lucide-react";
// import ScheduleView from "../components/ScheduleView"; // Temporarily disabled or needs refactor for multi-trainer
import TimeKeeper from "react-timekeeper";
import TrainerSelect from "../components/TrainerSelect";

const Dashboard = () => {
	const [trainers, setTrainers] = useState([]);
	const [selectedTrainerId, setSelectedTrainerId] = useState("");
	const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
	const [time, setTime] = useState("");
	const [showTimePicker, setShowTimePicker] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isTimeValid, setIsTimeValid] = useState(true);

	useEffect(() => {
		axios.get("/api/v1/trainers").then((res) => setTrainers(res.data.trainers));
	}, []);

	const validateTimeWithTrainer = (selectedTime) => {
		if (!selectedTime || !selectedTrainerId) return false;
		const hour = parseInt(selectedTime.split(':')[0]);

		// 1. General Gym Hours
		if (hour < 5 || hour >= 22) return false;

		// 2. Check selected trainer's working hours
		const trainer = trainers.find(t => t._id === selectedTrainerId);
		if (trainer) {
			const tStart = parseInt(trainer.workingHours.start.split(':')[0]);
			const tEnd = parseInt(trainer.workingHours.end.split(':')[0]);
			if (hour < tStart || hour >= tEnd) return false;
		}
		return true;
	};

	const handleBooking = async (e) => {
		e.preventDefault();
		if (!selectedTrainerId || !date || !time) {
			toast.error("Please fill in all fields (Select a trainer)");
			return;
		}

		if (!validateTimeWithTrainer(time)) {
			toast.error("Selected time is outside of Gym or Trainer working hours.");
			return;
		}

		setLoading(true);
		try {
			const start = new Date(`${date}T${time}`);
			const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour later

			await axios.post("/api/v1/gym/reserve", {
				trainerIds: [selectedTrainerId], // Backend expects array
				startTime: start.toISOString(),
				endTime: end.toISOString(),
			});
			toast.success("Reservation confirmed!");
			// Reset?
			setSelectedTrainerId("");
			setTime("");
		} catch (error) {
			toast.error(error.response?.data?.message || "Booking failed");
		} finally {
			setLoading(false);
		}
	};

	const formatTime = (timeStr) => {
		if (!timeStr) return "";
		const [hourStr, minute] = timeStr.split(':');
		let hour = parseInt(hourStr);
		const ampm = hour >= 12 ? 'PM' : 'AM';
		hour = hour % 12;
		hour = hour ? hour : 12;
		return `${hour}:${minute} ${ampm}`;
	};

	const selectedTrainer = trainers.find(t => t._id === selectedTrainerId);

	return (
		<div className='min-h-screen py-10 px-4 md:px-8 max-w-7xl mx-auto pb-40'>
			<header className='flex items-center justify-between mb-12 animate-in fade-in slide-in-from-top-4 duration-500'>
				<div className="flex items-center gap-4">
					<div className="p-3 bg-primary/10 rounded-2xl">
						<Users className='text-primary' size={32} />
					</div>
					<div>
						<h1 className='text-3xl font-black tracking-tight'>Dashboard</h1>
						<p className="text-muted-foreground">Book your training sessions.</p>
					</div>
				</div>
			</header>

			<div className='glass-panel p-8 md:p-12 rounded-[2rem] animate-in fade-in slide-in-from-bottom-8 duration-700'>
				<h2 className='text-2xl font-bold mb-8 flex items-center gap-3'>
					<Calendar className='text-primary' size={24} />
					<span>New Session</span>
				</h2>

				<form onSubmit={handleBooking} className='space-y-8'>
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* 1. Trainer Select */}
						<div className="lg:col-span-1">
							<TrainerSelect
								trainers={trainers}
								selectedId={selectedTrainerId}
								onChange={setSelectedTrainerId}
							/>
						</div>

						{/* 2. Date & Time */}
						<div className="lg:col-span-2 space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* Date Picker */}
								<div className="space-y-1">
									<label className='text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1'>Date</label>
									<div className="relative">
										<input
											type="date"
											className='w-full bg-secondary/30 border-b-2 border-border/50 focus:border-primary rounded-t-lg px-4 py-3 outline-none transition-all [color-scheme:light] dark:[color-scheme:dark] text-foreground font-medium hover:bg-secondary/50'
											value={date}
											min={new Date().toISOString().split('T')[0]}
											onChange={(e) => setDate(e.target.value)}
										/>
										<Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
									</div>
								</div>

								{/* Time Picker */}
								<div className="space-y-1 relative">
									<label className='text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1'>Start Time</label>
									<div className="relative">
										<button
											type="button"
											onClick={() => setShowTimePicker(!showTimePicker)}
											className='w-full bg-secondary/30 border-b-2 border-border/50 focus:border-primary rounded-t-lg px-4 py-3 outline-none transition-all text-foreground font-medium hover:bg-secondary/50 font-digital text-xl tracking-wider text-left flex items-center justify-between'
										>
											{time ? formatTime(time) : "--:--"}
											<Clock className="text-primary" size={20} />
										</button>

										{showTimePicker && (
											<div className={`absolute z-50 top-full left-0 mt-2 shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border bg-popover ${isTimeValid ? 'border-border' : 'border-red-500 border-2'}`}>
												<div className="[&_div]:!bg-popover [&_span]:!text-foreground">
													<TimeKeeper
														time={time || '12:00'}
														onChange={(data) => {
															setTime(data.formatted24);
															setIsTimeValid(validateTimeWithTrainer(data.formatted24));
														}}
														onDoneClick={() => {
															if (!validateTimeWithTrainer(time)) {
																toast.error("Invalid time for selected trainer");
																setIsTimeValid(false);
																return;
															}
															setIsTimeValid(true);
															setShowTimePicker(false)
														}}
														switchToMinuteOnHourSelect
													/>
												</div>
												<div className="bg-popover p-2 flex justify-end pb-4 pr-4 border-t border-border">
													<button
														type="button"
														onClick={() => setShowTimePicker(false)}
														className="text-primary font-bold text-sm uppercase hover:bg-accent/10 px-4 py-2 rounded-lg transition-colors"
													>
														Done
													</button>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>

							<div className="p-4 rounded-xl bg-secondary/20 border border-border/50 text-sm text-muted-foreground">
								<p className="font-bold mb-1 flex items-center gap-2"><Clock size={14} /> Working Hours Notice:</p>
								<ul className="list-disc list-inside space-y-1 ml-1">
									<li>Gym Hours: 05:00 AM - 10:00 PM</li>
									<li>Selected Trainers must be available.</li>
									{selectedTrainer && (
										<li className="text-primary">
											Checking availability for: {selectedTrainer.name} ({selectedTrainer.workingHours?.start}-{selectedTrainer.workingHours?.end})
										</li>
									)}
								</ul>
							</div>
						</div>
					</div>

					<button
						className='w-full md:w-auto px-10 bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-[1.01] active:scale-[0.99] py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg shadow-primary/20 flex justify-center items-center gap-2 mt-4'
						disabled={loading}
					>
						{loading ? <Loader className="animate-spin" /> : "Confirm Session"}
					</button>
				</form>
			</div >
		</div >
	);
};

export default Dashboard;