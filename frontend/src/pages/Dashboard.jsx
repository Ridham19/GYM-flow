import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Dumbbell, Calendar, Loader, Clock } from "lucide-react";
import ScheduleView from "../components/ScheduleView";

const Dashboard = () => {
	const [machines, setMachines] = useState([]);
	const [selectedMachine, setSelectedMachine] = useState("");
	const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
	const [time, setTime] = useState("");
	const [showTimePicker, setShowTimePicker] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		axios.get("/api/v1/gym/machines").then((res) => setMachines(res.data.machines));
	}, []);

	const handleBooking = async (e) => {
		e.preventDefault();
		if (!selectedMachine || !date || !time) {
			toast.error("Please fill in all fields");
			return;
		}

		const hour = parseInt(time.split(':')[0]);
		if (hour < 5 || hour >= 22) {
			toast.error("Gym is open from 5:00 AM to 10:00 PM");
			return;
		}

		setLoading(true);
		try {
			const start = new Date(`${date}T${time}`);
			const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour later

			await axios.post("/api/v1/gym/reserve", {
				machineId: selectedMachine,
				startTime: start.toISOString(),
				endTime: end.toISOString(),
			});
			toast.success("Reservation confirmed!");
			// Reset form or refresh schedule logic could go here
		} catch (error) {
			toast.error(error.response?.data?.message || "Booking failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen py-10 px-4 md:px-8 max-w-7xl mx-auto'>
			<header className='flex items-center justify-between mb-12 animate-in fade-in slide-in-from-top-4 duration-500'>
				<div className="flex items-center gap-4">
					<div className="p-3 bg-primary/10 rounded-2xl">
						<Dumbbell className='text-primary' size={32} />
					</div>
					<div>
						<h1 className='text-3xl font-black tracking-tight'>Dashboard</h1>
						<p className="text-muted-foreground">Manage your workouts and reservations.</p>
					</div>
				</div>
			</header>

			<div className='glass-panel p-8 md:p-12 rounded-[2rem] animate-in fade-in slide-in-from-bottom-8 duration-700'>
				<h2 className='text-2xl font-bold mb-8 flex items-center gap-3'>
					<Calendar className='text-primary' size={24} />
					<span>New Reservation</span>
				</h2>

				<form onSubmit={handleBooking} className='space-y-8'>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Machine Select */}
						<div className="space-y-1 relative group">
							<label className='text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1'>Equipment</label>
							<select
								className='w-full bg-secondary/30 border-b-2 border-white/10 focus:border-primary rounded-t-lg px-4 py-3 outline-none transition-all appearance-none cursor-pointer hover:bg-secondary/50 font-medium'
								value={selectedMachine}
								onChange={(e) => setSelectedMachine(e.target.value)}
							>
								<option value="" className="bg-background text-muted-foreground">Choose machine...</option>
								{machines.map(m => <option key={m._id} value={m._id} className="bg-background text-foreground">{m.name} ({m.category})</option>)}
							</select>
						</div>

						{/* Date Picker */}
						<div className="space-y-1">
							<label className='text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1'>Date</label>
							<div className="relative">
								<input
									type="date"
									className='w-full bg-secondary/30 border-b-2 border-white/10 focus:border-primary rounded-t-lg px-4 py-3 outline-none transition-all [color-scheme:dark] text-foreground font-medium hover:bg-secondary/50'
									value={date}
									min={new Date().toISOString().split('T')[0]}
									onChange={(e) => setDate(e.target.value)}
								/>
								<Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
							</div>
						</div>

						{/* Time Picker */}
						<div className="space-y-1 relative">
							<label className='text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1'>Start Time (5AM - 10PM)</label>
							<div className="relative">
								<button
									type="button"
									onClick={() => setShowTimePicker(!showTimePicker)}
									className='w-full bg-secondary/30 border-b-2 border-white/10 focus:border-primary rounded-t-lg px-4 py-3 outline-none transition-all [color-scheme:dark] text-foreground font-medium hover:bg-secondary/50 font-digital text-xl tracking-wider text-left flex items-center justify-between'
								>
									{time || "--:--"}
									<Clock className="text-primary" size={20} />
								</button>

								{showTimePicker && (
									<div className="absolute z-50 top-full left-0 mt-2 shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
										<TimeKeeper
											time={time}
											onChange={(data) => setTime(data.formatted24)}
											onDoneClick={() => setShowTimePicker(false)}
											switchToMinuteOnHourSelect
										/>
										<div className="bg-[#262626] p-2 flex justify-end pb-4 pr-4">
											<button
												onClick={() => setShowTimePicker(false)}
												className="text-primary font-bold text-sm uppercase hover:bg-white/5 px-3 py-1 rounded"
											>
												Done
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Visual Schedule View */}
					{selectedMachine && date && (
						<div className="animate-in fade-in slide-in-from-top-4 duration-500">
							<ScheduleView machineId={selectedMachine} date={date} />
						</div>
					)}

					<button
						className='w-full md:w-auto px-8 bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-[1.01] active:scale-[0.99] py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg shadow-primary/20 flex justify-center items-center gap-2 mt-4'
						disabled={loading}
					>
						{loading ? <Loader className="animate-spin" /> : "Confirm Reservation"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default Dashboard;