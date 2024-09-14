"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AnimatePresence, motion } from "framer-motion";
import {
	BookOpen,
	Bot,
	Brain,
	Cloud,
	Code,
	Cpu,
	Database,
	Volume2,
	VolumeX,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface FloatingIconProps {
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	x: number;
	y: number;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ icon: Icon, x, y }) => (
	<motion.div
		className="absolute text-blue-500 opacity-50"
		style={{ x, y }}
		animate={{ y: [y, y - 50, y], opacity: [0.5, 1, 0.5] }}
		transition={{
			repeat: Number.POSITIVE_INFINITY,
			duration: 5 + Math.random() * 5,
			ease: "easeInOut",
		}}
	>
		<Icon width={24 + Math.random() * 24} height={24 + Math.random() * 24} />
	</motion.div>
);

const FloatingIcons = () => {
	const icons = [Cpu, Database, Cloud, Bot];
	const [iconPositions, setIconPositions] = useState<
		{ x: number; y: number }[]
	>([]);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const positions = Array.from({ length: 20 }).map(() => ({
				x: Math.random() * (window.innerWidth - 24),
				y: Math.random() * (window.innerHeight - 24),
			}));
			setIconPositions(positions);
		}
	}, []);

	return (
		<div className="fixed inset-0 pointer-events-none">
			{iconPositions.map((pos) => {
				const icon = icons[Math.floor(Math.random() * icons.length)];
				return (
					<FloatingIcon key={pos.x + pos.y} icon={icon} x={pos.x} y={pos.y} />
				);
			})}
		</div>
	);
};

export default function HomePage() {
	const [showStory, setShowStory] = useState(false);
	const [isMuted, setIsMuted] = useState(true);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const timer = setTimeout(() => setShowStory(true), 1000);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((prev) => (prev < 100 ? prev + 1 : 0));
		}, 100);
		return () => clearInterval(interval);
	}, []);

	const modules = [
		{
			id: 1,
			title: "指导准则",
			description: "学习Prompt工程的基本原则",
			icon: <BookOpen className="h-6 w-6" />,
		},
		{
			id: 2,
			title: "提示开发",
			description: "掌握创建有效提示的技巧",
			icon: <Code className="h-6 w-6" />,
		},
		{
			id: 3,
			title: "总结能力",
			description: "学习如何简明扼要地总结信息",
			icon: <Brain className="h-6 w-6" />,
		},
		{
			id: 4,
			title: "推理能力",
			description: "培养逻辑推理和分析能力",
			icon: <Zap className="h-6 w-6" />,
		},
		{
			id: 5,
			title: "转换能力",
			description: "学习如何转换信息的形式和格式",
			icon: <Zap className="h-6 w-6" />,
		},
		{
			id: 6,
			title: "扩展能力",
			description: "掌握扩展和丰富内容的技巧",
			icon: <Zap className="h-6 w-6" />,
		},
	];

	const toggleMute = () => {
		setIsMuted((prev) => !prev);
		// TODO: 这里应该有控制背景音乐的逻辑
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 relative overflow-hidden">
			<FloatingIcons />
			<nav className="bg-white shadow-md relative z-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex">
							<div className="flex-shrink-0 flex items-center">
								<span className="font-bold text-xl text-blue-600">
									Prompt工程师训练营
								</span>
							</div>
							<div className="hidden sm:ml-6 sm:flex sm:space-x-8">
								{[
									"/",
									"/modules",
									"/challenges",
									"/achievements",
									"/leaderboard",
								].map((href) => (
									<Link
										key={href}
										href={href}
										className={`border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${href === "/" ? "border-blue-500 text-gray-900" : ""}`}
									>
										{href === "/" ? "主页" : href.replace("/", "")}
									</Link>
								))}
							</div>
						</div>
						<div className="flex items-center">
							<Button
								variant="ghost"
								size="icon"
								onClick={toggleMute}
								aria-label={isMuted ? "取消静音" : "静音"}
							>
								{isMuted ? (
									<VolumeX className="h-6 w-6" />
								) : (
									<Volume2 className="h-6 w-6" />
								)}
							</Button>
							<Avatar className="ml-4">
								<AvatarImage src="/logo.jpeg" alt="用户头像" />
								<AvatarFallback>AI</AvatarFallback>
							</Avatar>
						</div>
					</div>
				</div>
			</nav>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
				<motion.div
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center mb-12"
				>
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						欢迎来到Prompt工程师训练营
					</h1>
					<p className="text-xl text-gray-600 mb-8">
						帮助中小学生成为Prompt工程师，通过学习和游戏提升他们的知识和技能
					</p>
					<motion.div
						animate={{ scale: [1, 1.1, 1] }}
						transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
					>
						<Button
							className="px-8 py-3 text-lg"
							onClick={() => console.log("开始训练")}
						>
							开始训练
						</Button>
					</motion.div>
				</motion.div>

				<AnimatePresence>
					{showStory && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.5 }}
							className="bg-white p-6 rounded-lg shadow-lg mb-12"
						>
							<h2 className="text-2xl font-bold mb-4">你的AI冒险即将开始！</h2>
							<p className="text-gray-700">
								在不久的未来，人工智能已经成为日常生活中不可或缺的一部分。然而，只有掌握了Prompt工程技能的人才能真正驾驭AI的力量。你被选加入了一个精英训练营，目标是成为顶尖的Prompt工程师。在这里，你将学习如何引导AI，解决复杂问题，创造令人惊叹的内容。准备好接受挑战，开启你的AI冒险之旅了吗？
							</p>
							<div className="mt-4">
								<Progress value={progress} className="w-full" />
								<p className="text-sm text-gray-500 mt-2">
									加载训练模块中...{progress}%
								</p>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{modules.map((module) => (
						<motion.div
							key={module.id}
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							<Card className="hover:shadow-lg transition-shadow duration-300">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										{module.icon}
										{module.title}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>{module.description}</CardDescription>
									<Button variant="outline" className="w-full mt-4">
										进入学习
									</Button>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</main>

			<footer className="bg-white mt-12 relative z-10">
				<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
					<p className="text-center text-gray-500 text-sm">
						© 2023 Prompt工程师训练营. 保留所有权利.
					</p>
				</div>
			</footer>
		</div>
	);
}
