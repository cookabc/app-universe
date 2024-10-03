import { motion } from "framer-motion";

export const HeroSection = () => {
	return (
		<section className="relative h-[400px] flex items-center justify-center overflow-hidden">
			<svg
				className="absolute inset-0 w-full h-full"
				viewBox="0 0 1440 100"
				xmlns="http://www.w3.org/2000/svg"
			>
				<title>Background Wave</title>
				<defs>
					<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
						<stop
							offset="0%"
							style={{ stopColor: "#4A00E0", stopOpacity: 0.8 }}
						/>
						<stop
							offset="100%"
							style={{ stopColor: "#8E2DE2", stopOpacity: 0.8 }}
						/>
					</linearGradient>
				</defs>
				<path
					fill="url(#grad1)"
					d="M0,128L48,122.7C96,117,192,107,288,128C384,149,480,203,576,224C672,245,768,235,864,213.3C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
				/>
			</svg>
			<div className="relative z-10 text-center px-4">
				<motion.h2
					className="text-5xl font-extrabold mb-8 text-white text-shadow-lg"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					Welcome to Your App Ecosystem
				</motion.h2>
				<motion.p
					className="text-xl text-gray-200 max-w-2xl mx-auto text-shadow"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					Discover a collection of powerful web applications designed to enhance
					your digital experience. Each app is crafted with care and innovation
					to meet your unique needs.
				</motion.p>
			</div>
			<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent" />
		</section>
	);
};
