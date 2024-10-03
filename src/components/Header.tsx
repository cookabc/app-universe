import { AppIcon } from "@/components/AppIcon";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

export const Header = ({
	headerBackground,
	setIsMenuOpen,
}: {
	headerBackground: string;
	setIsMenuOpen: (isMenuOpen: boolean) => void;
}) => {
	return (
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
	);
};
