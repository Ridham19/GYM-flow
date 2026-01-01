import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authUser";
import { Loader, Mail, Lock, Dumbbell } from "lucide-react";

const LoginPage = () => {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const { login, isLoggingIn } = useAuthStore();

	const handleLogin = (e) => {
		e.preventDefault();
		login(formData);
	};

	return (
		<div className='min-h-screen bg-[#0b0f1a] flex items-center justify-center p-6 relative'>
            <div className="absolute inset-0 bg-gradient-to-b from-red-600/10 to-transparent pointer-events-none" />

			<div className='max-w-md w-full glass p-10 rounded-[2rem] shadow-2xl relative z-10'>
                <div className="flex justify-center mb-8">
                    <div className="bg-red-600 p-3 rounded-2xl shadow-lg shadow-red-600/20">
                        <Dumbbell className="text-white" size={32} />
                    </div>
                </div>

				<h2 className='text-3xl font-black text-center text-white mb-2 tracking-tight'>Welcome Back</h2>
                <p className="text-gray-500 text-center mb-10 font-medium">Log in to manage your workout</p>

				<form onSubmit={handleLogin} className='space-y-6'>
					<div className="space-y-2">
						<label className='text-xs font-bold text-gray-400 uppercase tracking-widest ml-1'>Email Address</label>
						<div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type='email'
                                className='w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder:text-gray-600'
                                placeholder="name@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
					</div>

					<div className="space-y-2">
						<label className='text-xs font-bold text-gray-400 uppercase tracking-widest ml-1'>Password</label>
						<div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type='password'
                                className='w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder:text-gray-600'
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
					</div>

					<button
						type='submit'
						className='w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-red-900/20 transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center'
						disabled={isLoggingIn}
					>
						{isLoggingIn ? <Loader className='animate-spin' size={24} /> : "Login"}
					</button>
				</form>

				<p className='mt-8 text-center text-gray-500 font-medium'>
					Don't have an account? <Link to='/signup' className='text-red-500 hover:text-red-400 transition-colors font-bold'>Sign Up</Link>
				</p>
			</div>
		</div>
	);
};

export default LoginPage;