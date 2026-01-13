import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authUser";
import { Loader, Eye, EyeOff } from "lucide-react";

const SignUpPage = () => {
	const [formData, setFormData] = useState({ email: "", username: "", password: "" });
	const [showPassword, setShowPassword] = useState(false);
	const { signup, isSigningUp } = useAuthStore();

	const handleSignUp = (e) => {
		e.preventDefault();
		signup(formData);
	};

	return (
		<div className='min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden'>
			<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 pointer-events-none" />

			<div className='w-[95%] max-w-md glass-panel p-6 md:p-10 rounded-[2rem] relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700'>
				<h2 className='text-2xl md:text-3xl font-black text-center mb-2 tracking-tight'>Join GymFlow</h2>
				<p className="text-muted-foreground text-center mb-6 md:mb-8 font-medium text-sm md:text-base">Start your fitness journey today</p>

				<form onSubmit={handleSignUp} className='space-y-4 md:space-y-5'>
					<div className="space-y-2">
						<label className='text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1'>Username</label>
						<input
							type='text'
							className='w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none placeholder:text-muted-foreground/50'
							placeholder="johndoe"
							value={formData.username}
							onChange={(e) => setFormData({ ...formData, username: e.target.value })}
						/>
					</div>
					<div className="space-y-2">
						<label className='text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1'>Email</label>
						<input
							type='email'
							className='w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none placeholder:text-muted-foreground/50'
							placeholder="name@email.com"
							value={formData.email}
							onChange={(e) => setFormData({ ...formData, email: e.target.value })}
						/>
					</div>
					<div className="space-y-2">
						<label className='text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1'>Password</label>
						<div className="relative">
							<input
								type={showPassword ? 'text' : 'password'}
								className='w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none placeholder:text-muted-foreground/50 pr-12'
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
						className='w-full py-3 md:py-4 mt-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center text-sm md:text-base'
						disabled={isSigningUp}
					>
						{isSigningUp ? <Loader className='animate-spin' size={20} /> : "Create Account"}
					</button>
				</form>
				<p className='mt-6 md:mt-8 text-center text-muted-foreground font-medium text-sm md:text-base'>
					Already a member? <Link to='/login' className='text-primary hover:underline font-bold'>Login</Link>
				</p>
			</div>
		</div>
	);
};

export default SignUpPage;