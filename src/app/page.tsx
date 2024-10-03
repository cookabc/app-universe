"use client";

import { AppGrid } from "@/components/AppGrid";
import { AppMenu } from "@/components/AppMenu";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import apps from "@/data/apps";
import { useScroll, useTransform } from "framer-motion";
import { useState } from "react";

export default function LandingPage() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { scrollY } = useScroll();
	const headerBackground = useTransform(
		scrollY,
		[0, 100],
		["rgba(17, 24, 39, 0)", "rgba(17, 24, 39, 0.8)"],
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
			<Header
				setIsMenuOpen={setIsMenuOpen}
				headerBackground={headerBackground.toString()}
			/>

			{isMenuOpen && <AppMenu setIsMenuOpen={setIsMenuOpen} apps={apps} />}

			<main className="container mx-auto px-4">
				<HeroSection />
				<AppGrid apps={apps} />
			</main>

			<Footer />
		</div>
	);
}
