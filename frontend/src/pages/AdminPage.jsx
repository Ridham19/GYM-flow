import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Plus, Trash2, ShieldCheck, UserPlus, Users, BarChart } from "lucide-react";

const AdminPage = () => {
	const [trainers, setTrainers] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [stats, setStats] = useState([]);

	// Form States
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		name: "",
		specialization: "General Fitness"
	});

	const [activeTab, setActiveTab] = useState("trainers");

	const fetchTrainers = async () => {
		try {
			const res = await axios.get("/api/v1/trainers");
			setTrainers(res.data.trainers);
		} catch (error) {
			console.error("Failed to fetch trainers:", error);
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

	const fetchStats = async () => {
		try {
			const res = await axios.get("/api/v1/trainers/stats");
			setStats(res.data.stats);
		} catch (error) {
			console.error("Failed to fetch stats:", error);
		}
	}

	useEffect(() => {
		fetchTrainers();
		fetchBookings();
	}, []);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleAdd = async (e) => {
		e.preventDefault();
		try {
			await axios.post("/api/v1/trainers/create", formData);
			toast.success("Trainer added successfully!");
			setFormData({ username: "", email: "", password: "", name: "", specialization: "General Fitness" });
			fetchTrainers();
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to add trainer");
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure? This deletes the trainer account.")) return;
		try {
			await axios.delete(`/api/v1/trainers/${id}`);
			toast.success("Trainer deleted");
			fetchTrainers();
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
					<p className="text-muted-foreground">Manage trainers, monitor stats and bookings.</p>
				</div>
			</header>

			{/* Navigation Tabs */}
			<div className="flex gap-4 mb-8">
				<button onClick={() => setActiveTab("trainers")} className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'trainers' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}>
					Manage Trainers
				</button>
				<button onClick={() => { setActiveTab("bookings"); fetchBookings(); }} className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'bookings' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}>
					Live Reservations
				</button>
				<button onClick={() => { setActiveTab("stats"); fetchStats(); }} className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'stats' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}>
					Analytics
				</button>
			</div>

			{activeTab === "trainers" && (
				<>
					<div className="glass-panel p-8 rounded-[2rem] mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
						<h2 className="text-xl font-bold mb-6 flex items-center gap-2"><UserPlus className="text-primary" /> Add New Trainer</h2>
						<form onSubmit={handleAdd} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end'>
							<div>
								<label className='text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-2 block'>Full Name</label>
								<input name="name" value={formData.name} onChange={handleChange} className='input-field' placeholder='e.g. John Doe' required />
							</div>
							<div>
								<label className='text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-2 block'>Username</label>
								<input name="username" value={formData.username} onChange={handleChange} className='input-field' placeholder='johndoe' required />
							</div>
							<div>
								<label className='text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-2 block'>Email</label>
								<input name="email" type="email" value={formData.email} onChange={handleChange} className='input-field' placeholder='john@example.com' required />
							</div>
							<div>
								<label className='text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-2 block'>Password</label>
								<input name="password" type="password" value={formData.password} onChange={handleChange} className='input-field' placeholder='Secret123' required />
							</div>
							<div>
								<label className='text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-2 block'>Specialization</label>
								<select name="specialization" value={formData.specialization} onChange={handleChange} className='input-field cursor-pointer'>
									<option className="bg-background">General Fitness</option>
									<option className="bg-background">Bodybuilding</option>
									<option className="bg-background">Crossfit</option>
									<option className="bg-background">Yoga</option>
									<option className="bg-background">Rehabilitation</option>
								</select>
							</div>
							<button className='w-full px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2'>
								<Plus size={18} /> Create Trainer
							</button>
						</form>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100'>
						{trainers.map(t => (
							<div key={t._id} className='glass-panel p-6 rounded-2xl flex justify-between items-start group hover:border-primary/50 transition-colors'>
								<div>
									<p className='font-bold text-lg mb-1'>{t.name}</p>
									<p className="text-sm text-muted-foreground mb-2">@{t.user?.username || 'unknown'}</p>
									<span className='inline-block px-3 py-1 rounded-full bg-secondary text-xs text-muted-foreground font-medium'>{t.specialization}</span>
									<div className="mt-4 text-xs text-muted-foreground">
										Hours: {t.workingHours?.start} - {t.workingHours?.end}
									</div>
								</div>
								<button onClick={() => handleDelete(t._id)} className='p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all' title="Delete Trainer">
									<Trash2 size={20} />
								</button>
							</div>
						))}
					</div>
				</>
			)}

			{activeTab === "bookings" && (
				<div className="glass-panel p-8 rounded-[2rem] animate-in fade-in slide-in-from-bottom-8 duration-700 overflow-hidden">
					<h2 className="text-xl font-bold mb-6">Active Reservations</h2>
					<div className="overflow-x-auto">
						<table className="w-full text-left">
							<thead className="bg-secondary/50 text-xs uppercase text-muted-foreground font-bold tracking-wider">
								<tr>
									<th className="p-4 rounded-tl-xl">User</th>
									<th className="p-4">Trainers</th>
									<th className="p-4">Start Time</th>
									<th className="p-4 rounded-tr-xl">End Time</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-white/5">
								{bookings.map((b) => (
									<tr key={b._id} className="hover:bg-white/5 transition-colors">
										<td className="p-4 font-bold">{b.user?.username}</td>
										<td className="p-4">
											<div className="flex flex-wrap gap-1">
												{b.trainers && b.trainers.map(t => (
													<span key={t._id} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-bold border border-primary/20">
														{t.name}
													</span>
												))}
											</div>
										</td>
										<td className="p-4 font-mono text-sm">{new Date(b.startTime).toLocaleString()}</td>
										<td className="p-4 font-mono text-sm">{new Date(b.endTime).toLocaleString()}</td>
									</tr>
								))}
								{bookings.length === 0 && (
									<tr><td colSpan="4" className="p-8 text-center text-muted-foreground">No active bookings found.</td></tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{activeTab === "stats" && (
				<div className="glass-panel p-8 rounded-[2rem] animate-in fade-in slide-in-from-bottom-8 duration-700">
					<h2 className="text-xl font-bold mb-6 flex items-center gap-2"><BarChart className="text-primary" /> Trainer Analytics</h2>
					<div className="overflow-x-auto">
						<table className="w-full text-left">
							<thead className="bg-secondary/50 text-xs uppercase text-muted-foreground font-bold tracking-wider">
								<tr>
									<th className="p-4 rounded-tl-xl">Trainer</th>
									<th className="p-4">Specialization</th>
									<th className="p-4">Total Bookings</th>
									<th className="p-4 rounded-tr-xl">Work Hours</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-white/5">
								{stats.map((s) => (
									<tr key={s._id} className="hover:bg-white/5 transition-colors">
										<td className="p-4 font-bold">{s.name}</td>
										<td className="p-4 text-sm text-muted-foreground">{s.specialization}</td>
										<td className="p-4 text-primary font-bold">{s.totalBookings}</td>
										<td className="p-4 text-sm">{s.workingHours?.start} - {s.workingHours?.end}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
};
export default AdminPage;