import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Dumbbell, Calendar, Loader } from "lucide-react";

const Dashboard = () => {
	const [machines, setMachines] = useState([]);
	const [selectedMachine, setSelectedMachine] = useState("");
	const [startTime, setStartTime] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		axios.get("/api/v1/gym/machines").then((res) => setMachines(res.data.machines));
	}, []);

	const handleBooking = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const start = new Date(startTime);
			const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour later

			await axios.post("/api/v1/gym/reserve", {
				machineId: selectedMachine,
				startTime: start.toISOString(),
				endTime: end.toISOString(),
			});
			toast.success("Reservation confirmed!");
		} catch (error) {
			toast.error(error.response?.data?.message || "Booking failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-[#0f172a] text-white p-8'>
			<div className='max-w-4xl mx-auto'>
				<header className='flex items-center gap-3 mb-12'>
					<Dumbbell className='text-red-600' size={40} />
					<h1 className='text-4xl font-black tracking-tighter'>GYM<span className='text-red-600'>FLOW</span></h1>
				</header>

				<div className='bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl'>
					<h2 className='text-2xl font-bold mb-8 text-gray-200 flex items-center gap-2'>
						<Calendar className='text-red-500' /> Reserve Your Machine
					</h2>
					<form onSubmit={handleBooking} className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div>
							<label className='block text-xs uppercase tracking-widest text-gray-500 mb-2'>Equipment</label>
							<select 
								className='w-full bg-white/10 border border-white/20 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-600 transition'
								value={selectedMachine}
								onChange={(e) => setSelectedMachine(e.target.value)}
							>
								<option value="" className="bg-gray-900">Choose machine...</option>
								{machines.map(m => <option key={m._id} value={m._id} className="bg-gray-900">{m.name}</option>)}
							</select>
						</div>
						<div>
							<label className='block text-xs uppercase tracking-widest text-gray-500 mb-2'>Pick a Time</label>
							<input 
								type="datetime-local" 
								className='w-full bg-white/10 border border-white/20 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-600 transition'
								value={startTime}
								onChange={(e) => setStartTime(e.target.value)}
							/>
						</div>
						<button 
							className='md:col-span-2 bg-gradient-to-r from-red-600 to-orange-600 hover:scale-[1.02] active:scale-95 py-4 rounded-xl font-black uppercase transition-all shadow-lg shadow-red-900/40'
						>
							{loading ? <Loader className="animate-spin mx-auto" /> : "Confirm Reservation"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;