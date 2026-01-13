import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Dumbbell, Calendar, Loader, Clock, Users, X, Check, AlertTriangle, ShieldCheck } from "lucide-react";
// import ScheduleView from "../components/ScheduleView"; 
import TimeKeeper from "react-timekeeper";
import TrainerSelect from "../components/TrainerSelect";
import Skeleton from "../components/Skeleton";

const Dashboard = () => {
	const [trainers, setTrainers] = useState([]);
	const [selectedTrainerId, setSelectedTrainerId] = useState("");
	const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
	const [time, setTime] = useState("");
	const [showTimePicker, setShowTimePicker] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isTimeValid, setIsTimeValid] = useState(true);

	// New State for bookings
	const [myBookings, setMyBookings] = useState([]);
	const [loadingBookings, setLoadingBookings] = useState(false);
	const [loadingTrainers, setLoadingTrainers] = useState(true);
	const [user, setUser] = useState(null);

	useEffect(() => {
		setLoadingTrainers(true);
		axios.get("/api/v1/trainers").then((res) => {
			if (res.data?.trainers) {
				setTrainers(res.data.trainers);
			}
		}).catch(err => toast.error("Failed to load trainers"))
			.finally(() => setLoadingTrainers(false));

		// Fetch user info for status
		axios.get("/api/v1/auth/check").then((res) => {
			setUser(res.data.user);
		});

		fetchMyBookings();
	}, []);

	const fetchMyBookings = () => {
		setLoadingBookings(true);
		axios.get("/api/v1/gym/my-bookings")
			.then((res) => setMyBookings(res.data.bookings))
			.catch((err) => console.error("Failed to load bookings", err))
			.finally(() => setLoadingBookings(false));
	};

	const validateTimeWithTrainer = (selectedTime) => {
		if (!selectedTime || !selectedTrainerId) return false;
		const hour = parseInt(selectedTime.split(':')[0]);

		// 1. General Gym Hours
		if (hour < 5 || hour >= 22) return false;

		// 2. Check selected trainer's working hours
		const trainer = trainers.find(t => t._id === selectedTrainerId);
		if (trainer && trainer.workingHours) {
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
			// Reset
			setSelectedTrainerId("");
			setTime("");
			fetchMyBookings(); // Refresh list
		} catch (error) {
			toast.error(error.response?.data?.message || "Booking failed");
		} finally {
			setLoading(false);
		}
	};

	const handleCancelBooking = async (id) => {
		if (!confirm("Are you sure you want to cancel this booking?")) return;
		try {
			await axios.delete(`/api/v1/gym/cancel/${id}`);
			toast.success("Booking cancelled");
			fetchMyBookings();
		} catch (error) {
			toast.error(error.response?.data?.message || "Cancel failed");
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

	const selectedTrainer = trainers?.find(t => t._id === selectedTrainerId);

	// Membership Logic
	const isMembershipActive = user?.paymentStatus === 'active';
	const isOverdue = user?.paymentStatus === 'overdue';
	const nextPayment = user?.nextPaymentDate ? new Date(user.nextPaymentDate) : null;
	const daysLeft = nextPayment ? Math.ceil((nextPayment - new Date()) / (1000 * 60 * 60 * 24)) : 0;

	const isBookingDisabled = isOverdue;

	return (
		<div className='min-h-screen pt-24 pb-10 px-4 md:px-8 max-w-7xl mx-auto'>
			<header className='flex items-center justify-between mb-6 md:mb-12 animate-in fade-in slide-in-from-top-4 duration-500'>
				<div className="flex items-center gap-3 md:gap-4">
					<div className="p-2 md:p-3 bg-primary/10 rounded-2xl">
						<Users className='text-primary' size={20} />
					</div>
					<div>
						<h1 className='text-xl md:text-3xl font-black tracking-tight'>Dashboard</h1>
						<p className="text-xs md:text-base text-muted-foreground">Book your training sessions.</p>
					</div>
				</div>
			</header>

			{/* Membership Status Banner */}
			{user && (
				<div className={`mb-6 md:mb-8 p-5 md:p-6 rounded-2xl border ${isOverdue ? 'bg-red-500/10 border-red-500/20' : 'bg-primary/5 border-primary/10'} animate-in fade-in slide-in-from-top-6 duration-700`}>
					<div className="flex items-center justify-between flex-wrap gap-4">
						<div className="flex items-center gap-4">
							<div className={`p-3 rounded-xl ${isOverdue ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'}`}>
								<ShieldCheck size={28} />
							</div>
							<div>
								<h2 className="text-lg md:text-xl font-bold">
									Membership Status: <span className={isOverdue ? 'text-red-500' : 'text-green-500'}>{user.paymentStatus.toUpperCase()}</span>
								</h2>
								{nextPayment && (
									<p className="text-muted-foreground text-sm md:text-base">
										Next Payment: <span className="font-mono font-bold">{nextPayment.toLocaleDateString()}</span>
										<span className='ml-2'>({daysLeft > 0 ? `${daysLeft} days left` : 'Expired'})</span>
									</p>
								)}
							</div>
						</div>
						{isOverdue && (
							<div className="w-full md:w-auto text-center px-4 py-2 bg-red-500 text-white font-bold rounded-lg shadow-lg shadow-red-500/20 animate-pulse text-sm">
								Please Contact Admin to Renew
							</div>
						)}
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 align-start">
				{/* Booking Form */}
				<div className={`glass-panel p-4 md:p-10 rounded-[2rem] animate-in fade-in slide-in-from-bottom-8 duration-700 h-fit relative z-20 ${isBookingDisabled ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
					<div className="flex justify-between items-start mb-6 md:mb-8">
						<h2 className='text-xl md:text-2xl font-bold flex items-center gap-3'>
							<Calendar className='text-primary' size={24} />
							<span>New Session</span>
						</h2>
						{isBookingDisabled && (
							<span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
								Disabled
							</span>
						)}
					</div>

					<form onSubmit={handleBooking} className='space-y-8'>
						<div className="space-y-8">
							{/* 1. Trainer Select */}
							<div>
								<TrainerSelect
									trainers={trainers}
									selectedId={selectedTrainerId}
									onChange={setSelectedTrainerId}
								/>
							</div>

							{/* 2. Date & Time */}
							<div className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Date Picker */}
									<div className="space-y-1">
										<label className='text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1'>Date</label>
										<div className="relative">
											<input
												type="date"
												className='w-full bg-secondary/30 border-b-2 border-border/50 focus:border-primary rounded-t-lg px-4 py-3 outline-none transition-all [color-scheme:light] dark:[color-scheme:dark] text-foreground font-medium hover:bg-secondary/50'
												value={date}
												min={new Date().toISOString().split('T')[0]} // Block past dates
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
							className='w-full px-10 bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-[1.01] active:scale-[0.99] py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg shadow-primary/20 flex justify-center items-center gap-2'
							disabled={loading}
						>
							{loading ? <Loader className="animate-spin" /> : "Confirm Session"}
						</button>
					</form>
				</div>

				{/* My Bookings Section */}
				<div className='glass-panel p-4 md:p-10 rounded-[2rem] animate-in fade-in slide-in-from-right-8 duration-900 h-fit'>
					<h2 className='text-2xl font-bold mb-8 flex items-center gap-3'>
						<Dumbbell className='text-primary' size={24} />
						<span>My Reservations</span>
					</h2>

					{loadingBookings ? (
						<div className="flex justify-center p-10"><Loader className="animate-spin text-muted-foreground" /></div>
					) : myBookings.length === 0 ? (
						<div className="text-center py-12 text-muted-foreground bg-secondary/20 rounded-xl border border-dashed border-border/50">
							<Calendar size={48} className="mx-auto mb-4 opacity-20" />
							<p>No active bookings found.</p>
						</div>
					) : (
						<div className="space-y-4">
							{myBookings.map((booking) => (
								<div key={booking._id} className="p-5 rounded-2xl bg-secondary/10 border border-border/50 hover:bg-secondary/20 transition-colors group">
									<div className="flex justify-between items-start">
										<div className="space-y-1">
											<div className="flex items-center gap-2 mb-2">
												<span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
													{new Date(booking.startTime).toLocaleDateString()}
												</span>
												<span className="text-sm font-medium text-muted-foreground">
													{new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
												</span>
											</div>
											<h3 className="font-bold text-lg flex items-center gap-2">
												{booking.trainers && booking.trainers.length > 0 ? booking.trainers.map(t => t.name).join(", ") : "Gym Session"}
											</h3>
											<p className="text-sm text-muted-foreground">
												Status: <span className="text-green-500 font-bold">Confirmed</span>
											</p>
										</div>
										<button
											onClick={() => handleCancelBooking(booking._id)}
											className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
											title="Cancel Booking"
										>
											<X size={20} />
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div >
	);
};

export default Dashboard;