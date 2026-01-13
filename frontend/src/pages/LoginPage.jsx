import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authUser";
import { Loader, Mail, Lock, Dumbbell, Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [showPassword, setShowPassword] = useState(false);
	const { login, isLoggingIn } = useAuthStore();

	const handleLogin = (e) => {
		e.preventDefault();
		login(formData);
	};

	return (
		<div className='min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden'>
			<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 pointer-events-none" />

			<div className='w-[95%] max-w-md glass-panel p-6 md:p-10 rounded-[2rem] shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700'>
				<div className="flex justify-center mb-6 md:mb-8">
					<div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/20">
						<Dumbbell className="text-primary-foreground" size={28} />
					</div>
				</div>

				<h2 className='text-2xl md:text-3xl font-black text-center mb-2 tracking-tight'>Welcome Back</h2>
				<p className="text-muted-foreground text-center mb-8 md:mb-10 font-medium text-sm md:text-base">Log in to manage your workout</p>

				<form onSubmit={handleLogin} className='space-y-6'>
					<div className="space-y-2">
						<label className='text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1'>Email Address</label>
						<div className="relative">
							<Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
							<input
								type='email'
								className='w-full pl-12 pr-4 py-3 md:py-4 rounded-2xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none placeholder:text-muted-foreground/50'
								placeholder="name@email.com"
								value={formData.email}
								onChange={(e) => setFormData({ ...formData, email: e.target.value })}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label className='text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1'>Password</label>
						<div className="relative">
							<Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
							<input
								type={showPassword ? 'text' : 'password'}
								className='w-full pl-12 pr-12 py-3 md:py-4 rounded-2xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none placeholder:text-muted-foreground/50'
								placeholder="••••••••"
								value={formData.password}
								onChange={(e) => setFormData({ ...formData, password: e.target.value })}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
							>
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
					</div>

					<button
						type='submit'
						className='w-full py-3 md:py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center text-sm md:text-base'
						disabled={isLoggingIn}
					>
						{isLoggingIn ? <Loader className='animate-spin' size={24} /> : "Login"}
					</button>
				</form>

				<p className='mt-8 text-center text-muted-foreground font-medium text-sm md:text-base'>
					Don't have an account? <Link to='/signup' className='text-primary hover:text-primary/80 transition-colors font-bold'>Sign Up</Link>
				</p>
			</div>
		</div>
	);
};

export default LoginPage;