import { Link } from "react-router-dom";
import { Dumbbell, ArrowRight, ShieldCheck, Zap } from "lucide-react";

const HomePage = () => {
	return (
		<div className='min-h-screen flex flex-col relative overflow-x-hidden'>
			{/* Hero Section */}
			<main className='relative z-10 flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center animate-in fade-in zoom-in duration-700 min-h-[90vh]'>
				<div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-sm text-muted-foreground mb-8 backdrop-blur-sm">
					<Zap size={14} className="text-yellow-500" />
					<span>The #1 Gym Management Tool</span>
				</div>

				<h1 className='text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none'>
					WORKOUT <br />
					<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-600 animate-gradient">
						WITHOUT WAITING.
					</span>
				</h1>

				<p className='text-muted-foreground text-lg md:text-xl max-w-2xl mb-12 leading-relaxed'>
					Reserve your favorite equipment in real-time. Join 2,000+ members optimizing
					their gains by skipping the line.
				</p>

				<div className='flex flex-col sm:flex-row gap-4'>
					<Link
						to='/signup'
						className='bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20'
					>
						Get Started Now <ArrowRight size={20} />
					</Link>
					<a href="#features" className='px-10 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-all hover:bg-white/5 border border-white/10'>
						Learn More
					</a>
				</div>
			</main>

			{/* Features Section */}
			<section id="features" className="py-24 relative">
				<div className="max-w-7xl mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-5xl font-black mb-4">Why GymFlow?</h2>
						<p className="text-muted-foreground text-lg max-w-2xl mx-auto">Build your body, not your patience. We give you the tools to maximize your time at the gym.</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[
							{ icon: <ShieldCheck className="text-green-500" size={32} />, title: "Instant Booking", desc: "Secure your spot on any machine instantly. No more awkward hovering." },
							{ icon: <Dumbbell className="text-blue-500" size={32} />, title: "Premium Equipment", desc: "Access to top-tier machinery managed in real-time inventory." },
							{ icon: <Zap className="text-orange-500" size={32} />, title: "Live Availability", desc: "See exactly what's free before you even leave your house." },
						].map((f, i) => (
							<div key={i} className="glass-panel p-8 rounded-3xl text-left hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 group cursor-default">
								<div className="mb-4 bg-white/5 w-12 h-12 flex items-center justify-center rounded-xl group-hover:bg-primary/10 transition-colors">
									{f.icon}
								</div>
								<h3 className="font-bold text-xl mb-2">{f.title}</h3>
								<p className="text-muted-foreground leading-relaxed">{f.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Stats/About Section */}
			<section className="py-24 border-y border-white/5 bg-white/[0.02]">
				<div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
					<div>
						<h2 className="text-3xl md:text-5xl font-black mb-6">Built for Serious Lifters</h2>
						<p className="text-muted-foreground text-lg leading-relaxed mb-8">
							We understand that timing is everything. Whether you're hitting a PR or super-setting,
							waiting for equipment kills your momentum. GymFlow was created to put you back in control of your workout schedule.
						</p>
						<ul className="space-y-4">
							{['24/7 Access to Booking', 'Mobile Optimized', 'Real-time Analytics'].map((item, i) => (
								<li key={i} className="flex items-center gap-3 font-medium">
									<div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
										<div className="w-2 h-2 rounded-full bg-primary" />
									</div>
									{item}
								</li>
							))}
						</ul>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="glass-panel p-6 rounded-2xl text-center">
							<div className="text-4xl font-black text-primary mb-1">2k+</div>
							<div className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Members</div>
						</div>
						<div className="glass-panel p-6 rounded-2xl text-center mt-8">
							<div className="text-4xl font-black text-blue-500 mb-1">50+</div>
							<div className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Machines</div>
						</div>
						<div className="glass-panel p-6 rounded-2xl text-center">
							<div className="text-4xl font-black text-purple-500 mb-1">100%</div>
							<div className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Uptime</div>
						</div>
						<div className="glass-panel p-6 rounded-2xl text-center mt-8">
							<div className="text-4xl font-black text-green-500 mb-1">4.9</div>
							<div className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Rating</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-32 px-6 text-center">
				<div className="max-w-4xl mx-auto glass-panel p-12 rounded-[3rem] relative overflow-hidden">
					<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
					<h2 className="text-3xl md:text-5xl font-black mb-6 relative z-10">Ready to crush your goals?</h2>
					<p className="text-muted-foreground text-lg mb-8 relative z-10">Join thousands of others who have optimized their training.</p>
					<Link
						to='/signup'
						className='relative z-10 inline-flex bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-5 rounded-full font-bold text-lg items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20'
					>
						Join GymFlow Today
					</Link>
				</div>
			</section>
		</div>
	);
};

export default HomePage;