"use client";

import { AppGrid } from "@/components/AppGrid";
import { AppMenu } from "@/components/AppMenu";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import apps from "@/data/apps";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function LandingPage() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [particles, setParticles] = useState<
		Array<{
			id: number;
			initialX: number;
			initialY: number;
			targetX: number;
			targetY: number;
			size: number;
			duration: number;
		}>
	>([]);

	const { scrollY } = useScroll();
	const headerBackground = useTransform(
		scrollY,
		[0, 100],
		["rgba(17, 24, 39, 0)", "rgba(17, 24, 39, 0.8)"],
	);

	// Generate particles only on the client side
	useEffect(() => {
		const generateParticles = (count: number) => {
			return Array.from({ length: count }, (_, index) => ({
				id: index,
				initialX: Math.random() * window.innerWidth,
				initialY: Math.random() * window.innerHeight,
				targetX: Math.random() * window.innerWidth,
				targetY: Math.random() * window.innerHeight,
				size: Math.random() * 3 + 1,
				duration: Math.random() * 20 + 10,
			}));
		};

		setParticles(generateParticles(20));
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
			<Header
				setIsMenuOpen={setIsMenuOpen}
				headerBackground={headerBackground.toString()}
			/>

			{isMenuOpen && <AppMenu setIsMenuOpen={setIsMenuOpen} apps={apps} />}

			<main className="container mx-auto px-4">
				{/* Particles Background */}
				<div className="fixed inset-0 z-0">
					{particles.map((particle) => (
						<motion.div
							key={particle.id}
							className="particle absolute"
							initial={{
								x: particle.initialX,
								y: particle.initialY,
							}}
							animate={{
								x: particle.targetX,
								y: particle.targetY,
							}}
							transition={{
								duration: particle.duration,
								repeat: Number.POSITIVE_INFINITY,
								repeatType: "reverse",
								ease: "linear",
							}}
						/>
					))}
				</div>
				<HeroSection />
				<AppGrid apps={apps} />
			</main>

			<Footer />
		</div>
	);
}
