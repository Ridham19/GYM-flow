import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Plus, Trash2, ShieldCheck } from "lucide-react";

const AdminPage = () => {
	const [machines, setMachines] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [name, setName] = useState("");
	const [category, setCategory] = useState("Cardio");
	const [activeTab, setActiveTab] = useState("machines");

	const fetchMachines = async () => {
		try {
			const res = await axios.get("/api/v1/gym/machines");
			setMachines(res.data.machines);
		} catch (error) {
			console.error("Failed to fetch machines:", error);
		}
	};

	const fetchBookings = async () => {
		try {
			const res = await axios.get("/api/v1/gym/admin/bookings");
			setBookings(res.data.bookings);
		} catch (error) {
			console.error("Failed to fetch bookings:", error);
		}
	};

	useEffect(() => {
		fetchMachines();
		fetchBookings();
	}, []);

	const handleAdd = async (e) => {
		e.preventDefault();
		try {
			await axios.post("/api/v1/gym/admin/add", { name, category });
			toast.success("Machine added!");
			setName("");
			fetchMachines();
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to add machine");
		}
	};

	const handleDelete = async (id) => {
		try {
			await axios.delete(`/api/v1/gym/admin/${id}`);
			toast.success("Machine deleted");
			fetchMachines();
		} catch (error) {
			toast.error(error.response?.data?.message || "Delete failed");
		}
	};

	return (
		<div className='min-h-screen p-8 max-w-7xl mx-auto'>
			<header className='flex items-center gap-4 mb-10 animate-in fade-in slide-in-from-top-4 duration-500'>
				<div className="p-3 bg-red-500/10 rounded-2xl">
					<ShieldCheck className='text-red-500' size={32} />
				</div>
				<div>
					<h1 className='text-3xl font-black tracking-tight'>Admin Dashboard</h1>
					<p className="text-muted-foreground">Manage gym inventory and monitor usage.</p>
				</div>
			</header>

			{/* Navigation Tabs */}
			<div className="flex gap-4 mb-8">
				<button
					onClick={() => setActiveTab("machines")}
					className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'machines' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}
				>
					Manage Machines
				</button>
				<button
					onClick={() => { setActiveTab("bookings"); fetchBookings(); }}
					className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'bookings' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}
				>
					Live Reservations
				</button>
			</div>

			{activeTab === "machines" ? (
				<>
					<div className="glass-panel p-8 rounded-[2rem] mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
						<h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus className="text-primary" /> Add New Machine</h2>
						<form onSubmit={handleAdd} className='flex flex-col md:flex-row gap-6 items-end'>
							<div className='flex-1 w-full'>
								<label className='text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-2 block'>Machine Name</label>
								<input
									value={name}
									onChange={e => setName(e.target.value)}
									className='w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none placeholder:text-muted-foreground/50'
									placeholder='e.g. Treadmill 05'
								/>
							</div>
							<div className="w-full md:w-64">
								<label className='text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-2 block'>Category</label>
								<select
									value={category}
									onChange={e => setCategory(e.target.value)}
									className='w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none cursor-pointer'
								>
									<option className="bg-background">Cardio</option>
									<option className="bg-background">Strength</option>
									<option className="bg-background">Weights</option>
								</select>
							</div>
							<button className='w-full md:w-auto px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2'>
								<Plus size={18} /> Add
							</button>
						</form>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100'>
						{machines.map(m => (
							<div key={m._id} className='glass-panel p-6 rounded-2xl flex justify-between items-center group hover:border-primary/50 transition-colors'>
								<div>
									<p className='font-bold text-lg mb-1'>{m.name}</p>
									<span className='inline-block px-3 py-1 rounded-full bg-secondary text-xs text-muted-foreground font-medium'>{m.category}</span>
								</div>
								<button
									onClick={() => handleDelete(m._id)}
									className='p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all'
									title="Delete Machine"
								>
									<Trash2 size={20} />
								</button>
							</div>
						))}
					</div>
				</>
			) : (
				<div className="glass-panel p-8 rounded-[2rem] animate-in fade-in slide-in-from-bottom-8 duration-700 overflow-hidden">
					<h2 className="text-xl font-bold mb-6">Active Reservations</h2>
					<div className="overflow-x-auto">
						<table className="w-full text-left">
							<thead className="bg-secondary/50 text-xs uppercase text-muted-foreground font-bold tracking-wider">
								<tr>
									<th className="p-4 rounded-tl-xl">User</th>
									<th className="p-4">Email</th>
									<th className="p-4">Machine</th>
									<th className="p-4">Start Time</th>
									<th className="p-4 rounded-tr-xl">End Time</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-white/5">
								{bookings.map((b) => (
									<tr key={b._id} className="hover:bg-white/5 transition-colors">
										<td className="p-4 font-bold">{b.user.username}</td>
										<td className="p-4 text-sm text-muted-foreground">{b.user.email}</td>
										<td className="p-4">
											<span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
												{b.machine.name}
											</span>
										</td>
										<td className="p-4 font-mono text-sm">{new Date(b.startTime).toLocaleString()}</td>
										<td className="p-4 font-mono text-sm">{new Date(b.endTime).toLocaleString()}</td>
									</tr>
								))}
								{bookings.length === 0 && (
									<tr>
										<td colSpan="5" className="p-8 text-center text-muted-foreground">No active bookings found.</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
};
export default AdminPage;