import { motion } from "framer-motion";

export const HeroSection = () => {
	return (
		<section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
			<div className="relative z-10 text-center px-6 sm:px-8 max-w-4xl mx-auto">
				<motion.div
					className="space-y-8"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
				>
					<h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white">
						Build Your Digital World
						<span className="block mt-4 text-2xl sm:text-3xl md:text-4xl font-normal">
							One App at a Time
						</span>
					</h2>

					<p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
						Explore our curated collection of innovative tools designed to
						streamline your workflow and boost productivity.
					</p>

					<div className="flex items-center justify-center gap-4 mt-8">
						<button
							type="button"
							className="px-8 py-3 bg-white rounded-lg font-medium text-purple-600 hover:bg-white/90 transition-colors"
						>
							Get Started
						</button>
						<button
							type="button"
							className="px-8 py-3 border border-white rounded-lg font-medium text-white hover:bg-white/10 transition-colors"
						>
							Learn More
						</button>
					</div>
				</motion.div>
			</div>
		</section>
	);
};
