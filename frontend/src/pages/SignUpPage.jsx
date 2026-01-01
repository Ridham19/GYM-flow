import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authUser";
import { Loader } from "lucide-react";

const SignUpPage = () => {
	const [formData, setFormData] = useState({ email: "", username: "", password: "" });
	const { signup, isSigningUp } = useAuthStore();

	const handleSignUp = (e) => {
		e.preventDefault();
		signup(formData);
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-900 text-white'>
			<div className='max-w-md w-full p-8 bg-gray-800 rounded-lg shadow-xl'>
				<h2 className='text-3xl font-bold text-center mb-6'>Join the Gym</h2>
				<form onSubmit={handleSignUp} className='space-y-4'>
					<div>
						<label className='block text-sm font-medium'>Username</label>
						<input
							type='text'
							className='w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500'
							value={formData.username}
							onChange={(e) => setFormData({ ...formData, username: e.target.value })}
						/>
					</div>
					<div>
						<label className='block text-sm font-medium'>Email</label>
						<input
							type='email'
							className='w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500'
							value={formData.email}
							onChange={(e) => setFormData({ ...formData, email: e.target.value })}
						/>
					</div>
					<div>
						<label className='block text-sm font-medium'>Password</label>
						<input
							type='password'
							className='w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500'
							value={formData.password}
							onChange={(e) => setFormData({ ...formData, password: e.target.value })}
						/>
					</div>
					<button
						type='submit'
						className='w-full py-2 bg-red-600 hover:bg-red-700 rounded font-semibold flex justify-center items-center'
						disabled={isSigningUp}
					>
						{isSigningUp ? <Loader className='animate-spin' size={20} /> : "Sign Up"}
					</button>
				</form>
				<p className='mt-4 text-center text-gray-400'>
					Already a member? <Link to='/login' className='text-red-500 hover:underline'>Login</Link>
				</p>
			</div>
		</div>
	);
};

export default SignUpPage;