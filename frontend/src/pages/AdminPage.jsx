import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/authUser";
import { UserPlus, Trash2, Calendar, ShieldCheck, BarChart, Users, Plus } from "lucide-react";
import Skeleton from "../components/Skeleton";

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState("trainers");
    const [trainers, setTrainers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState([]);
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: "", username: "", email: "", password: "", specialization: "General Fitness"
    });
    const [renewalDays, setRenewalDays] = useState(30);
    const [isLoading, setIsLoading] = useState(false);

    // Fetching Logic based on Active Tab
    useEffect(() => {
        if (activeTab === "trainers") fetchTrainers();
        else if (activeTab === "bookings") fetchBookings();
        else if (activeTab === "stats") fetchStats();
        else if (activeTab === "users") fetchUsers();
    }, [activeTab]);

    const fetchTrainers = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("/api/v1/trainers");
            setTrainers(res.data.trainers);
        } catch (error) {
            toast.error("Failed to load trainers");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("/api/v1/admin/bookings");
            setBookings(res.data.bookings);
        } catch (error) {
            toast.error("Failed to load bookings");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("/api/v1/admin/stats");
            setStats(res.data.stats);
        } catch (error) {
            toast.error("Failed to load stats");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("/api/v1/admin/users");
            setUsers(res.data.users);
        } catch (error) {
            toast.error("Failed to load users");
        } finally {
            setIsLoading(false);
        }
    };

    // Action Handlers
    const handleApprove = async (id) => {
        try {
            await axios.put(`/api/v1/gym/admin/approve-user/${id}`);
            toast.success("User approved");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to approve user");
        }
    };

    const handleRenew = async (id) => {
        if (renewalDays <= 0) return toast.error("Days must be > 0");
        try {
            await axios.put(`/api/v1/gym/admin/approve-payment/${id}`, { action: 'renew', days: renewalDays });
            toast.success(`Membership renewed for ${renewalDays} days`);
            fetchUsers();
        } catch (error) {
            toast.error("Failed to renew membership");
        }
    };

    const handleCancelMembership = async (id) => {
        if (!window.confirm("Are you sure you want to CANCEL this membership? The user will lose access immediately.")) return;
        try {
            await axios.put(`/api/v1/gym/admin/approve-payment/${id}`, { action: 'cancel' });
            toast.success("Membership cancelled");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to cancel membership");
        }
    };

    const handleAddTrainer = async (e) => {
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

    const handleDeleteTrainer = async (id) => {
        if (!window.confirm("Are you sure? This deletes the trainer account.")) return;
        try {
            await axios.delete(`/api/v1/trainers/${id}`);
            toast.success("Trainer deleted");
            fetchTrainers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Delete failed");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className='min-h-screen pt-24 pb-8 px-4 md:px-8 max-w-7xl mx-auto'>
            <header className='flex items-center gap-3 md:gap-4 mb-8 md:mb-10 animate-in fade-in slide-in-from-top-4 duration-500'>
                <div className="p-2 md:p-3 bg-red-500/10 rounded-2xl">
                    <ShieldCheck className='text-red-500' size={24} />
                </div>
                <div>
                    <h1 className='text-xl md:text-3xl font-black tracking-tight'>Admin Dashboard</h1>
                    <p className="text-xs md:text-base text-muted-foreground">Manage trainers, monitor stats and bookings.</p>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="flex gap-4 mb-6 md:mb-8 overflow-x-auto pb-4 scrollbar-hide flex-nowrap -mx-4 px-4 md:mx-0 md:px-0 snap-x">
                {[
                    { id: 'trainers', label: 'Manage Trainers' },
                    { id: 'bookings', label: 'Live Reservations' },
                    { id: 'stats', label: 'Analytics' },
                    { id: 'users', label: 'User Management' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`snap-center whitespace-nowrap px-6 py-2 rounded-full font-bold transition-all ${
                            activeTab === tab.id ? 'bg-red-600 text-white' : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Trainers Tab */}
            {activeTab === "trainers" && (
                <>
                    <div className="bg-white/5 border border-white/10 backdrop-blur-md p-5 md:p-8 rounded-[2rem] mb-8 md:mb-10">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><UserPlus className="text-red-500" /> Add New Trainer</h2>
                        <form onSubmit={handleAddTrainer} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end'>
                            <div>
                                <label className='text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block'>Full Name</label>
                                <input name="name" value={formData.name} onChange={handleChange} className='w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-red-600 outline-none' placeholder='e.g. John Doe' required />
                            </div>
                            <div>
                                <label className='text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block'>Username</label>
                                <input name="username" value={formData.username} onChange={handleChange} className='w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-red-600 outline-none' placeholder='johndoe' required />
                            </div>
                            <div>
                                <label className='text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block'>Email</label>
                                <input name="email" type="email" value={formData.email} onChange={handleChange} className='w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-red-600 outline-none' placeholder='john@example.com' required />
                            </div>
                            <div>
                                <label className='text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block'>Password</label>
                                <input name="password" type="password" value={formData.password} onChange={handleChange} className='w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-red-600 outline-none' placeholder='Secret123' required />
                            </div>
                            <div>
                                <label className='text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block'>Specialization</label>
                                <select name="specialization" value={formData.specialization} onChange={handleChange} className='w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-red-600 outline-none'>
                                    <option className="bg-gray-900">General Fitness</option>
                                    <option className="bg-gray-900">Bodybuilding</option>
                                    <option className="bg-gray-900">Crossfit</option>
                                    <option className="bg-gray-900">Yoga</option>
                                    <option className="bg-gray-900">Rehabilitation</option>
                                </select>
                            </div>
                            <button className='w-full px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold uppercase tracking-widest shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2'>
                                <Plus size={18} /> Create Trainer
                            </button>
                        </form>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {isLoading ? (
                            [...Array(6)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)
                        ) : (
                            trainers.map(t => (
                                <div key={t._id} className='bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl flex justify-between items-start group hover:border-red-500/50 transition-colors'>
                                    <div>
                                        <p className='font-bold text-lg mb-1'>{t.name}</p>
                                        <p className="text-sm text-gray-400 mb-2">@{t.user?.username || 'unknown'}</p>
                                        <span className='inline-block px-3 py-1 rounded-full bg-white/10 text-xs text-gray-300 font-medium'>{t.specialization}</span>
                                    </div>
                                    <button onClick={() => handleDeleteTrainer(t._id)} className='p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-all'>
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
                <div className="bg-white/5 border border-white/10 p-5 md:p-8 rounded-[2rem]">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Users className="text-red-500" /> User Management</h2>

                    {/* Pending Approvals Section */}
                    <div className="mb-10">
                        <h3 className="text-lg font-bold mb-4 text-orange-400">Pending Approvals</h3>
                        <div className="space-y-4">
                            {users.filter(u => !u.isApproved).length === 0 ? (
                                <p className="text-center text-gray-500 p-6 bg-white/5 rounded-xl border border-dashed border-white/10">No pending approvals.</p>
                            ) : (
                                users.filter(u => !u.isApproved).map(u => (
                                    <div key={u._id} className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 flex flex-col md:flex-row justify-between items-center gap-4">
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center font-bold">{u.username.charAt(0).toUpperCase()}</div>
                                            <div>
                                                <p className="font-bold">{u.username}</p>
                                                <p className="text-xs text-gray-400">{u.email}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleApprove(u._id)} className="w-full md:w-auto px-6 py-2 bg-orange-500 text-white rounded-lg font-bold text-xs uppercase tracking-wider">
                                            Approve User
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Active Members Section */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-blue-400">Active Memberships</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400 uppercase font-bold">Renewal Days:</span>
                                <input type="number" value={renewalDays} onChange={(e) => setRenewalDays(e.target.value)} className="w-16 bg-white/5 border border-white/10 rounded px-2 py-1 text-sm font-bold text-center outline-none focus:border-red-500" />
                            </div>
                        </div>

                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-xs uppercase text-gray-400 font-bold tracking-wider">
                                    <tr>
                                        <th className="p-4 rounded-tl-xl">Username</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Next Payment</th>
                                        <th className="p-4 rounded-tr-xl">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {isLoading ? (
                                        [...Array(5)].map((_, i) => <tr key={i}><td colSpan="4" className="p-4"><Skeleton className="h-12 w-full" /></td></tr>)
                                    ) : (
                                        users.filter(u => u.isApproved).map(u => (
                                            <tr key={u._id} className="hover:bg-white/5 transition-colors">
                                                <td className="p-4 font-bold">{u.username}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                        u.paymentStatus === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                                    }`}>
                                                        {u.paymentStatus}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm font-mono text-gray-400">
                                                    {u.nextPaymentDate ? new Date(u.nextPaymentDate).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="p-4 flex gap-2">
                                                    <button onClick={() => handleRenew(u._id)} className="px-3 py-1.5 bg-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg font-bold text-[10px] uppercase">Renew</button>
                                                    <button onClick={() => handleCancelMembership(u._id)} className="px-3 py-1.5 bg-red-500/20 text-red-500 hover:bg-red-600 hover:text-white rounded-lg font-bold text-[10px] uppercase">Cancel</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards for Members */}
                        <div className="md:hidden space-y-4">
                            {users.filter(u => u.isApproved).map(u => (
                                <div key={u._id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                                    <div className="flex justify-between">
                                        <p className="font-bold">{u.username}</p>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.paymentStatus === 'active' ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>{u.paymentStatus}</span>
                                    </div>
                                    <div className="text-xs text-gray-400 bg-black/20 p-2 rounded">Next Payment: {u.nextPaymentDate ? new Date(u.nextPaymentDate).toLocaleDateString() : 'N/A'}</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => handleRenew(u._id)} className="py-2 bg-blue-600 text-white rounded-lg font-bold text-[10px] uppercase">Renew</button>
                                        <button onClick={() => handleCancelMembership(u._id)} className="py-2 bg-red-600 text-white rounded-lg font-bold text-[10px] uppercase">Cancel</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;