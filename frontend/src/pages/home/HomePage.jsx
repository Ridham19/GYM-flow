import { Link } from "react-router-dom";
import { Dumbbell, ArrowRight, ShieldCheck, Zap } from "lucide-react";

const HomePage = () => {
	return (
		<div className='min-h-screen bg-[#0b0f1a] text-white overflow-hidden relative'>
			{/* Background Ambient Glow */}
			<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/20 blur-[120px] rounded-full" />
			<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />

			<nav className="flex justify-between items-center p-6 max-w-7xl mx-auto relative z-10">
				<div className="flex items-center gap-2">
					<Dumbbell className="text-red-500" size={32} />
					<span className="text-2xl font-black tracking-tighter italic">GYMFLOW</span>
				</div>
				<Link to="/login" className="hover:text-red-500 transition-colors font-medium">Login</Link>
			</nav>

			<main className='relative z-10 flex flex-col items-center justify-center pt-20 px-6 text-center'>
				<div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-sm text-gray-400 mb-6">
					<Zap size={14} className="text-yellow-500" />
					<span>The #1 Gym Management Tool</span>
				</div>

				<h1 className='text-6xl md:text-8xl font-black mb-6 tracking-tight leading-none'>
					WORKOUT <br />
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">WITHOUT WAITING.</span>
				</h1>
				
				<p className='text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed'>
					Reserve your favorite equipment in real-time. Join 2,000+ members optimizing 
					their gains by skipping the line.
				</p>

				<div className='flex flex-col sm:flex-row gap-4'>
					<Link
						to='/signup'
						className='bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95'
					>
						Get Started Now <ArrowRight size={20} />
					</Link>
				</div>

				{/* Feature Badges */}
				<div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
					{[
						{ icon: <ShieldCheck className="text-green-500" />, title: "Instant Booking", desc: "No manual logs." },
						{ icon: <Dumbbell className="text-blue-500" />, title: "40+ Machines", desc: "Full inventory." },
						{ icon: <Zap className="text-orange-500" />, title: "Real-time Sync", desc: "Live availability." },
					].map((f, i) => (
						<div key={i} className="glass p-6 rounded-2xl text-left">
							<div className="mb-3">{f.icon}</div>
							<h3 className="font-bold text-lg">{f.title}</h3>
							<p className="text-gray-500 text-sm">{f.desc}</p>
						</div>
					))}
				</div>
			</main>
		</div>
	);
};

export default HomePage;