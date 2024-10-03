"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const AppIcon = () => (
	<svg
		width="40"
		height="40"
		viewBox="0 0 40 40"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<title>App Icon</title>
		<circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
		<path
			d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
		/>
		<circle cx="20" cy="20" r="4" fill="currentColor" />
	</svg>
);

export default function LandingPage() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { scrollY } = useScroll();
	const headerBackground = useTransform(
		scrollY,
		[0, 100],
		["rgba(17, 24, 39, 0)", "rgba(17, 24, 39, 0.8)"],
	);

	const apps = [
		{
			name: "MBTI Test",
			description: "Take the MBTI personality test",
			color: "#FF6B6B",
			path: "/mbti-test",
		},
		{
			name: "Social Media",
			description: "Connect with friends and share updates",
			color: "#4ECDC4",
			path: "/social-media",
		},
		{
			name: "Salary Calculator",
			description: "Calculate your expected salary",
			color: "#45B7D1",
			path: "/salary-calculator",
		},
		{
			name: "Contribution Graph",
			description: "Visualize your contributions over time",
			color: "#F7B731",
			path: "/contribution-graph",
		},
		{
			name: "AI Artifacts",
			description: "Discover AI-generated artifacts",
			color: "#4B7BEC",
			path: "/ai-artifacts",
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
			<motion.header
				className="fixed w-full p-6 flex justify-between items-center z-50"
				style={{ background: headerBackground }}
			>
				<div className="flex items-center space-x-2">
					<AppIcon />
					<h1 className="text-2xl font-bold tracking-tighter">App Universe</h1>
				</div>
				<nav className="hidden md:block">
					<motion.button
						className="text-white bg-purple-600 bg-opacity-80 px-4 py-2 rounded-full hover:bg-opacity-100 transition-colors"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => setIsMenuOpen(true)}
					>
						Explore Apps
					</motion.button>
				</nav>
				<button
					type="button"
					className="md:hidden"
					onClick={() => setIsMenuOpen(true)}
				>
					<Menu className="h-6 w-6" />
				</button>
			</motion.header>

			{isMenuOpen && (
				<motion.div
					initial={{ opacity: 0, x: "100%" }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: "100%" }}
					className="fixed inset-0 bg-gray-900 bg-opacity-90 z-50 flex flex-col"
				>
					<div className="flex justify-end p-6">
						<button type="button" onClick={() => setIsMenuOpen(false)}>
							<X className="h-6 w-6" />
						</button>
					</div>
					<nav className="flex-1 flex items-center justify-center">
						<ul className="space-y-6 text-center">
							{apps.map((app) => (
								<motion.li
									key={app.name}
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
								>
									<a
										href="/"
										className="text-2xl font-bold hover:text-gray-300 transition-colors"
										style={{ color: app.color }}
									>
										{app.name}
									</a>
								</motion.li>
							))}
						</ul>
					</nav>
				</motion.div>
			)}

			<main className="container mx-auto px-4">
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
							Discover a collection of powerful web applications designed to
							enhance your digital experience. Each app is crafted with care and
							innovation to meet your unique needs.
						</motion.p>
					</div>
					<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent" />
				</section>

				<section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
					{apps.map((app, index) => (
						<motion.div
							key={app.name}
							className="relative overflow-hidden rounded-lg shadow-lg backdrop-blur-md bg-white bg-opacity-10"
							whileHover={{ scale: 1.05, rotate: 1 }}
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<div className="p-6 h-full flex flex-col justify-between">
								<div>
									<h3
										className="text-2xl font-bold mb-2"
										style={{ color: app.color }}
									>
										{app.name}
									</h3>
									<p className="text-gray-300">{app.description}</p>
								</div>
								<motion.a
									href={app.path}
									className="inline-flex items-center text-white font-semibold mt-4"
									whileHover={{ x: 10 }}
								>
									Launch App
									<svg
										className="ml-2 h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<title>Launch App</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</motion.a>
							</div>
							<div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 opacity-50 blur-xl" />
						</motion.div>
					))}
				</section>
			</main>

			<footer className="mt-20 py-8 text-center text-gray-400">
				<p>&copy; 2024 App Universe. All rights reserved.</p>
			</footer>
		</div>
	);
}
