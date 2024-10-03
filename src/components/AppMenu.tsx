import type { AppData } from "@/data/apps";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export const AppMenu = ({
	setIsMenuOpen,
	apps,
}: {
	setIsMenuOpen: (isMenuOpen: boolean) => void;
	apps: AppData[];
}) => {
	return (
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
	);
};
