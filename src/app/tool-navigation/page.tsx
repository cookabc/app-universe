"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import {
	ChevronUp,
	ExternalLink,
	Menu,
	Moon,
	Search,
	Star,
	Sun,
	ThumbsDown,
	ThumbsUp,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

interface Tool {
	id: number;
	name: string;
	url: string;
	category: string;
	description: string;
	icon: string;
	rating: number;
	votes: number;
}

const initialTools: Tool[] = [
	{
		id: 1,
		name: "Google",
		url: "https://www.google.com",
		category: "搜索",
		description: "全球最大的搜索引擎",
		icon: "🔍",
		rating: 4.5,
		votes: 1000,
	},
	{
		id: 2,
		name: "ChatGPT",
		url: "https://chat.openai.com",
		category: "AI",
		description: "强大的AI对话模型",
		icon: "🤖",
		rating: 4.7,
		votes: 800,
	},
	{
		id: 3,
		name: "GitHub",
		url: "https://github.com",
		category: "开发",
		description: "代码托管和协作平台",
		icon: "🐙",
		rating: 4.6,
		votes: 950,
	},
	{
		id: 4,
		name: "Figma",
		url: "https://www.figma.com",
		category: "设计",
		description: "协作设计工具",
		icon: "🎨",
		rating: 4.8,
		votes: 750,
	},
	{
		id: 5,
		name: "Notion",
		url: "https://www.notion.so",
		category: "生产力",
		description: "all-in-one工作空间",
		icon: "📝",
		rating: 4.4,
		votes: 700,
	},
	{
		id: 6,
		name: "Vercel",
		url: "https://vercel.com",
		category: "开发",
		description: "前端部署平台",
		icon: "▲",
		rating: 4.5,
		votes: 600,
	},
	{
		id: 7,
		name: "Canva",
		url: "https://www.canva.com",
		category: "设计",
		description: "在线图形设计平台",
		icon: "🖼️",
		rating: 4.3,
		votes: 850,
	},
	{
		id: 8,
		name: "Trello",
		url: "https://trello.com",
		category: "生产力",
		description: "项目管理工具",
		icon: "📊",
		rating: 4.2,
		votes: 720,
	},
];

export default function EnhancedUIUXToolNavigation() {
	const [searchTerm, setSearchTerm] = useState("");
	const [darkMode, setDarkMode] = useState(false);
	const [showScrollTop, setShowScrollTop] = useState(false);
	const [favorites, setFavorites] = useState<number[]>([]);
	const [recentlyUsed, setRecentlyUsed] = useState<number[]>([]);
	const [tools, setTools] = useState<Tool[]>(initialTools);
	const [isLoading, setIsLoading] = useState(true);
	const categories = Array.from(new Set(tools.map((tool) => tool.category)));
	const searchInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const storedFavorites = localStorage.getItem("favorites");
		if (storedFavorites) {
			setFavorites(JSON.parse(storedFavorites));
		}
		const storedRecentlyUsed = localStorage.getItem("recentlyUsed");
		if (storedRecentlyUsed) {
			setRecentlyUsed(JSON.parse(storedRecentlyUsed));
		}
		const storedDarkMode = localStorage.getItem("darkMode");
		if (storedDarkMode) {
			setDarkMode(JSON.parse(storedDarkMode));
		}
		// Simulate loading delay
		setTimeout(() => setIsLoading(false), 1000);
	}, []);

	useEffect(() => {
		localStorage.setItem("favorites", JSON.stringify(favorites));
	}, [favorites]);

	useEffect(() => {
		localStorage.setItem("recentlyUsed", JSON.stringify(recentlyUsed));
	}, [recentlyUsed]);

	useEffect(() => {
		localStorage.setItem("darkMode", JSON.stringify(darkMode));
	}, [darkMode]);

	const filteredTools = tools.filter(
		(tool) =>
			tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			tool.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
			tool.description.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.key === "/" && event.target !== searchInputRef.current) {
				event.preventDefault();
				searchInputRef.current?.focus();
			}
		};
		const handleScroll = () => {
			setShowScrollTop(window.pageYOffset > 300);
		};
		window.addEventListener("keydown", handleKeyPress);
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("keydown", handleKeyPress);
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const toggleFavorite = useCallback((id: number) => {
		setFavorites((prev) =>
			prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id],
		);
	}, []);

	const addToRecentlyUsed = useCallback((id: number) => {
		setRecentlyUsed((prev) =>
			[id, ...prev.filter((rId) => rId !== id)].slice(0, 5),
		);
	}, []);

	const handleToolClick = useCallback(
		(tool: Tool) => {
			window.open(tool.url, "_blank");
			addToRecentlyUsed(tool.id);
		},
		[addToRecentlyUsed],
	);

	const handleVote = useCallback((toolId: number, isUpvote: boolean) => {
		setTools((prevTools) =>
			prevTools.map((tool) =>
				tool.id === toolId
					? {
							...tool,
							rating:
								(tool.rating * tool.votes + (isUpvote ? 1 : -1)) /
								(tool.votes + 1),
							votes: tool.votes + 1,
						}
					: tool,
			),
		);
	}, []);

	const ToolCard = ({ tool }: { tool: Tool }) => {
		const [ref, inView] = useInView({
			triggerOnce: true,
			rootMargin: "-50px 0px",
		});

		return (
			<motion.div
				ref={ref}
				initial={{ opacity: 0, y: 20 }}
				animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
				transition={{ duration: 0.5 }}
				className="group"
			>
				<div
					className={`relative w-full h-full flex flex-col items-start justify-between p-6 rounded-xl shadow-lg transition-all duration-300 overflow-hidden ${
						darkMode
							? "bg-gray-800 hover:bg-gray-700"
							: "bg-white hover:bg-gray-50"
					} transform hover:scale-105 hover:-rotate-1`}
				>
					<div className="z-10 w-full">
						<div className="flex items-center justify-between mb-2">
							<div className="flex items-center">
								<span className="text-3xl mr-3 transition-transform duration-300 group-hover:scale-125">
									{tool.icon}
								</span>
								<h3 className="text-xl font-semibold">{tool.name}</h3>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="text-yellow-500 hover:text-yellow-600 transition-transform duration-300 hover:scale-110"
								onClick={(e) => {
									e.stopPropagation();
									toggleFavorite(tool.id);
								}}
							>
								<Star
									className={favorites.includes(tool.id) ? "fill-current" : ""}
								/>
							</Button>
						</div>
						<p
							className={`text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
						>
							{tool.description}
						</p>
						<div className="flex justify-between items-center mb-4">
							<div className="flex items-center">
								<span className="text-lg font-semibold mr-2">
									{tool.rating.toFixed(1)}
								</span>
								<span className="text-sm text-gray-500">({tool.votes} 票)</span>
							</div>
							<div className="flex space-x-2">
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="outline"
												size="sm"
												className="transition-transform duration-300 hover:scale-110"
												onClick={(e) => {
													e.stopPropagation();
													handleVote(tool.id, true);
												}}
											>
												<ThumbsUp className="h-4 w-4" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>好评</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="outline"
												size="sm"
												className="transition-transform duration-300 hover:scale-110"
												onClick={(e) => {
													e.stopPropagation();
													handleVote(tool.id, false);
												}}
											>
												<ThumbsDown className="h-4 w-4" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>差评</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						</div>
						<Button
							variant="outline"
							className="w-full justify-center transition-colors duration-300 hover:bg-purple-500 hover:text-white"
							onClick={() => handleToolClick(tool)}
						>
							访问网站 <ExternalLink className="ml-2 h-4 w-4" />
						</Button>
					</div>
					<div className="absolute -right-12 -bottom-12 w-24 h-24 bg-purple-500 rounded-full opacity-10 transition-transform duration-300 transform group-hover:scale-150" />
				</div>
			</motion.div>
		);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500" />
			</div>
		);
	}

	return (
		<div
			className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-purple-100 to-indigo-200"}`}
		>
			<div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
				<motion.header
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center mb-12"
				>
					<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
						工具导航
					</h1>
					<p className="text-lg sm:text-xl mb-8 opacity-75">
						发现并访问最佳在线工具
					</p>
					<motion.div
						className="relative max-w-2xl mx-auto"
						initial={{ scale: 0.8 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.3 }}
					>
						<Input
							type="text"
							placeholder="搜索工具... (按 '/' 快速搜索)"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className={`w-full pl-12 pr-4 py-3 sm:py-4 rounded-full text-base sm:text-lg shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
							ref={searchInputRef}
						/>
						<Search
							className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
							size={24}
						/>
					</motion.div>
				</motion.header>

				<div className="mb-8">
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="outline" className="lg:hidden mb-4">
								<Menu className="mr-2 h-4 w-4" /> 分类
							</Button>
						</SheetTrigger>
						<SheetContent side="left">
							<nav className="flex flex-col space-y-4">
								{categories.map((category) => (
									<Button
										key={category}
										variant="ghost"
										onClick={() => {
											const element = document.getElementById(category);
											if (element) {
												element.scrollIntoView({ behavior: "smooth" });
											}
										}}
									>
										{category}
									</Button>
								))}
							</nav>
						</SheetContent>
					</Sheet>
					<Tabs defaultValue="all" className="space-y-4">
						<TabsList>
							<TabsTrigger value="all">全部</TabsTrigger>
							<TabsTrigger value="favorites">收藏夹</TabsTrigger>
							<TabsTrigger value="recent">最近使用</TabsTrigger>
						</TabsList>
						<TabsContent value="all">
							<AnimatePresence>
								{categories.map((category) => (
									<motion.div
										key={category}
										id={category}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -20 }}
										transition={{ duration: 0.3 }}
										className="mb-12"
									>
										<h2 className="text-2xl sm:text-3xl font-semibold mb-6 pl-2 border-l-4 border-purple-500">
											{category}
										</h2>
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
											{filteredTools
												.filter((tool) => tool.category === category)
												.map((tool) => (
													<ToolCard key={tool.id} tool={tool} />
												))}
										</div>
									</motion.div>
								))}
							</AnimatePresence>
						</TabsContent>
						<TabsContent value="favorites">
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{tools
									.filter((tool) => favorites.includes(tool.id))
									.map((tool) => (
										<ToolCard key={tool.id} tool={tool} />
									))}
							</div>
						</TabsContent>
						<TabsContent value="recent">
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{tools
									.filter((tool) => recentlyUsed.includes(tool.id))
									.map((tool) => (
										<ToolCard key={tool.id} tool={tool} />
									))}
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>

			<motion.div
				className="fixed bottom-8 right-8 flex flex-col gap-4"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
			>
				<AnimatePresence>
					{showScrollTop && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
						>
							<Button
								variant="outline"
								size="icon"
								className="rounded-full p-2 bg-purple-500 text-white hover:bg-purple-600 transition-transform duration-300 hover:scale-110"
								onClick={scrollToTop}
							>
								<ChevronUp className="h-6 w-6" />
							</Button>
						</motion.div>
					)}
				</AnimatePresence>
				<Button
					variant="outline"
					size="icon"
					className={`rounded-full p-2 ${darkMode ? "bg-yellow-500 text-gray-900" : "bg-gray-800 text-white"} transition-transform duration-300 hover:scale-110`}
					onClick={() => setDarkMode(!darkMode)}
				>
					{darkMode ? (
						<Sun className="h-6 w-6" />
					) : (
						<Moon className="h-6 w-6" />
					)}
				</Button>
			</motion.div>
		</div>
	);
}
