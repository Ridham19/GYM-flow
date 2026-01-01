import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Plus, Trash2, ShieldCheck } from "lucide-react";

const AdminPage = () => {
	const [machines, setMachines] = useState([]);
	const [name, setName] = useState("");
	const [category, setCategory] = useState("Cardio");

	const fetchMachines = async () => {
		const res = await axios.get("/api/v1/gym/machines");
		setMachines(res.data.machines);
	};

	useEffect(() => { fetchMachines(); }, []);

	const handleAdd = async (e) => {
		e.preventDefault();
		try {
			await axios.post("/api/v1/gym/admin/add", { name, category });
			toast.success("Machine added!");
			setName("");
			fetchMachines();
		} catch (err) { toast.error("Failed to add machine"); }
	};

	const handleDelete = async (id) => {
		try {
			await axios.delete(`/api/v1/gym/admin/${id}`);
			toast.success("Machine deleted");
			fetchMachines();
		} catch (err) { toast.error("Delete failed"); }
	};

	return (
		<div className='min-h-screen bg-gray-900 text-white p-8'>
			<h1 className='text-3xl font-bold mb-8 flex items-center gap-2'><ShieldCheck className='text-red-500'/> Admin Equipment Manager</h1>
			
			<form onSubmit={handleAdd} className='bg-gray-800 p-6 rounded-lg mb-8 flex gap-4 items-end'>
				<div className='flex-1'>
					<label className='block text-sm mb-1'>Machine Name</label>
					<input value={name} onChange={e => setName(e.target.value)} className='w-full bg-gray-700 p-2 rounded' placeholder='e.g. Treadmill 05' />
				</div>
				<div>
					<label className='block text-sm mb-1'>Category</label>
					<select value={category} onChange={e => setCategory(e.target.value)} className='bg-gray-700 p-2 rounded'>
						<option>Cardio</option>
						<option>Strength</option>
						<option>Weights</option>
					</select>
				</div>
				<button className='bg-red-600 p-2 rounded px-4 hover:bg-red-700 flex items-center gap-1'><Plus size={18}/> Add</button>
			</form>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{machines.map(m => (
					<div key={m._id} className='bg-gray-800 p-4 rounded flex justify-between items-center border border-gray-700'>
						<div>
							<p className='font-bold'>{m.name}</p>
							<p className='text-xs text-gray-400'>{m.category}</p>
						</div>
						<button onClick={() => handleDelete(m._id)} className='text-gray-500 hover:text-red-500'><Trash2 size={18}/></button>
					</div>
				))}
			</div>
		</div>
	);
};
export default AdminPage;