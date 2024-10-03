import type { AppData } from "@/data/apps";
import { motion } from "framer-motion";

export const AppGrid = ({ apps }: { apps: AppData[] }) => {
	return (
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
	);
};
