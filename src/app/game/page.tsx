"use client";

import { api } from "@/app/api/game/route";
import type {
	Achievement,
	LeaderboardData,
	PlayerData,
} from "@/app/interfaces";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowLeft,
	Award,
	BarChart2,
	Book,
	Home,
	Play,
	Settings,
	Star,
	Trophy,
	Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import CharacterCustomization from "./CharacterCustomization";

const levels = [
	{
		id: 1,
		name: "Prompt 入门",
		description: "学习基础的 Prompt 编写技巧",
		icon: Book,
		color: "bg-green-500",
		challenges: [
			{
				id: 1,
				name: "基础提示创建",
				description: "创建你的第一个AI提示",
				task: "创建一个简单的提示，让AI生成一个短篇故事。",
			},
			{
				id: 2,
				name: "提示结构化",
				description: "学习如何结构化你的提示以获得更好的结果",
				task: "创建一个结构化的提示，包含背景、要求和输出格式。",
			},
			{
				id: 3,
				name: "上下文添加",
				description: "了解如何为你的提示添加有效的上下文",
				task: "为一个现有的提示添加相关的上下文信息，以改善AI的输出。",
			},
		],
	},
	{
		id: 2,
		name: "总结技能",
		description: "学习如何准确地总结长篇文章或数据",
		icon: BarChart2,
		color: "bg-blue-500",
		challenges: [
			{
				id: 1,
				name: "关键点提取",
				description: "从长文本中提取关键信息",
				task: "创建一个提示，从给定的长文本中提取3-5个关键点。",
			},
			{
				id: 2,
				name: "长文本压缩",
				description: "将长文本压缩成简洁的摘要",
				task: "设计一个提示，将一篇长文章压缩成不超过100字的摘要。",
			},
			{
				id: 3,
				name: "多源信息整合",
				description: "整合多个来源的信息生成综合摘要",
				task: "创建一个提示，整合三个不同来源的信息，生成一个综合性摘要。",
			},
		],
	},
	{
		id: 3,
		name: "推理任务",
		description: "学习如何从信息中推理出隐藏的内容",
		icon: Star,
		color: "bg-yellow-500",
		challenges: [
			{
				id: 1,
				name: "逻辑推理",
				description: "基于给定信息进行逻辑推理",
				task: "设计一个提示，让AI基于给定的前提进行逻辑推理并得出结论。",
			},
			{
				id: 2,
				name: "隐含信息提取",
				description: "从文本中提取隐含的信息",
				task: "创建一个提示，从一段文本中提取未明确陈述但可以推断出的信息。",
			},
			{
				id: 3,
				name: "假设检验",
				description: "生成并验证基于给定信息的假设",
				task: "设计一个提示，让AI根据给定信息生成假设，并提供验证这些假设的方法。",
			},
		],
	},
	{
		id: 4,
		name: "转换技巧",
		description: "学习如何将原始数据转换成不同的语言或格式",
		icon: Trophy,
		color: "bg-purple-500",
		challenges: [
			{
				id: 1,
				name: "语言翻译",
				description: "使用AI进行准确的语言翻译",
				task: "创建一个提示，将一段英文文本准确翻译成中文，保持原文的语气和风格。",
			},
			{
				id: 2,
				name: "格式转换",
				description: "将数据从一种格式转换为另一种格式",
				task: "设计一个提示，将一个JSON格式的数据转换为人类可读的报告格式。",
			},
			{
				id: 3,
				name: "风格转换",
				description: "改变文本的写作风格",
				task: "创建一个提示，将一段正式的商业文本转换为更加轻松友好的口吻。",
			},
		],
	},
	{
		id: 5,
		name: "扩展任务",
		description: "学习如何通过 Prompt 生成更复杂的内容或任务",
		icon: Users,
		color: "bg-red-500",
		challenges: [
			{
				id: 1,
				name: "创意写作",
				description: "使用AI生成创意故事或诗歌",
				task: "设计一个提示，让AI创作一个科幻短篇故事，包含特定的主题和角色。",
			},
			{
				id: 2,
				name: "代码生成",
				description: "通过提示生成简单的代码片段",
				task: "创建一个提示，让AI生成一个简单的Python函数，实现特定的功能。",
			},
			{
				id: 3,
				name: "多步骤任务",
				description: "设计处理复杂、多步骤任务的提示",
				task: "设计一个多步骤的提示，指导AI完成一个复杂任务，如创建一个详细的项目计划。",
			},
		],
	},
];

export default function PromptEngineeringGame() {
	const [gameState, setGameState] = useState("mainMenu");
	const [playerData, setPlayerData] = useState<PlayerData>();
	const [currentLevel, setCurrentLevel] = useState(0);
	const [currentChallenge, setCurrentChallenge] = useState(0);
	const [leaderboard, setLeaderboard] = useState<LeaderboardData[]>([]);
	const [achievements, setAchievements] = useState<Achievement[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const initializeGame = async () => {
			setIsLoading(true);
			await loadPlayerData();
			await loadLeaderboard();
			await loadAchievements();
			setIsLoading(false);
		};
		initializeGame();
	}, []);

	const loadPlayerData = async () => {
		try {
			const data: PlayerData = await api.getPlayerData();
			setPlayerData(data);
		} catch (error) {
			console.error("Failed to load player data:", error);
			toast({
				title: "错误",
				description: "加载玩家数据失败，请稍后再试。",
				variant: "destructive",
			});
		}
	};

	const loadLeaderboard = async () => {
		try {
			const data: LeaderboardData[] = await api.getLeaderboard();
			setLeaderboard(data);
		} catch (error) {
			console.error("Failed to load leaderboard:", error);
			toast({
				title: "错误",
				description: "加载排行榜失败，请稍后再试。",
				variant: "destructive",
			});
		}
	};

	const loadAchievements = async () => {
		try {
			const data: Achievement[] = await api.getAchievements();
			setAchievements(data);
		} catch (error) {
			console.error("Failed to load achievements:", error);
			toast({
				title: "错误",
				description: "加载成就失败，请稍后再试。",
				variant: "destructive",
			});
		}
	};

	const startGame = () => {
		if (playerData) {
			setGameState("worldMap");
		} else {
			setGameState("characterCreation");
		}
	};

	const handleCharacterCreation = async (character: PlayerData) => {
		try {
			await api.updatePlayerData(character);
			await loadPlayerData();
			setGameState("worldMap");
			toast({
				title: "欢迎来到 Prompt Engineering 冒险！",
				description: "你的任务是成为最强大的提示工程师，拯救这个虚拟世界。",
			});
		} catch (error) {
			console.error("Failed to create character:", error);
			toast({
				title: "错误",
				description: "创建角色失败，请稍后再试。",
				variant: "destructive",
			});
		}
	};

	const startLevel = (levelId: number) => {
		setCurrentLevel(levelId);
		setCurrentChallenge(1);
		setGameState("levelChallenge");
	};

	const handleLevelComplete = async (score: number) => {
		try {
			await api.submitScore(score);
			await loadPlayerData();
			await loadLeaderboard();
			setGameState("worldMap");
			toast({
				title: "关卡完成！",
				description: `你获得了 ${score} 经验值！`,
			});
		} catch (error) {
			console.error("Failed to complete level:", error);
			toast({
				title: "错误",
				description: "提交分数失败，请稍后再试。",
				variant: "destructive",
			});
		}
	};

	const openSettings = () => {
		toast({
			title: "设置",
			description: "设置功能正在开发中，敬请期待！",
		});
	};

	const renderMainMenu = () => (
		<motion.div
			initial={{ scale: 0.8, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="flex flex-col items-center justify-center h-screen"
		>
			<Card className="w-full max-w-md mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
				<CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
					<CardTitle className="text-4xl font-bold text-center">
						Prompt Engineering 冒险
					</CardTitle>
					<CardDescription className="text-center text-lg text-purple-100">
						成为最强大的提示工程师，拯救虚拟世界！
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center space-y-6 p-6">
					{playerData && (
						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.2 }}
						>
							<Avatar className="w-32 h-32 border-4 border-purple-500">
								<AvatarImage src={playerData.avatar} alt={playerData.name} />
								<AvatarFallback>
									{playerData.name ? playerData.name[0] : "P"}
								</AvatarFallback>
							</Avatar>
						</motion.div>
					)}
					<Button
						onClick={startGame}
						className="w-full text-xl py-6 bg-green-500 hover:bg-green-600 text-white transition-colors duration-200"
					>
						<Play className="mr-2 h-6 w-6" />{" "}
						{playerData ? "继续冒险" : "开始冒险"}
					</Button>
					<Button
						onClick={openSettings}
						variant="outline"
						className="w-full text-xl py-6 border-purple-500 text-purple-500 hover:bg-purple-50 transition-colors duration-200"
					>
						<Settings className="mr-2 h-6 w-6" /> 设置
					</Button>
				</CardContent>
			</Card>
		</motion.div>
	);

	const renderSidebar = () => (
		<nav className="w-64 bg-white shadow-lg">
			<div className="p-4">
				<h2 className="text-2xl font-bold text-purple-600">Prompt 冒险</h2>
			</div>
			<ul className="space-y-2 p-4">
				<li>
					<Button
						variant={gameState === "worldMap" ? "secondary" : "ghost"}
						className="w-full justify-start"
						onClick={() => setGameState("worldMap")}
					>
						<Home className="mr-2 h-5 w-5" /> 主页
					</Button>
				</li>
				<li>
					<Button
						variant={gameState === "leaderboard" ? "secondary" : "ghost"}
						className="w-full justify-start"
						onClick={() => setGameState("leaderboard")}
					>
						<Trophy className="mr-2 h-5 w-5" /> 排行榜
					</Button>
				</li>
				<li>
					<Button
						variant={gameState === "achievements" ? "secondary" : "ghost"}
						className="w-full justify-start"
						onClick={() => setGameState("achievements")}
					>
						<Award className="mr-2 h-5 w-5" /> 成就
					</Button>
				</li>
				<li>
					<Button
						variant="ghost"
						className="w-full justify-start"
						onClick={openSettings}
					>
						<Settings className="mr-2 h-5 w-5" /> 设置
					</Button>
				</li>
			</ul>
		</nav>
	);

	const renderWorldMap = () => (
		<div className="flex h-screen bg-gray-100">
			{renderSidebar()}
			<main className="flex-1 p-8 overflow-auto">
				<div className="max-w-4xl mx-auto space-y-8">
					<div className="flex items-center justify-between">
						<h1 className="text-3xl font-bold text-purple-600">
							欢迎回来，{playerData?.name || "魔法师"}！
						</h1>
						<Badge
							variant="secondary"
							className="text-lg py-2 px-4 bg-purple-500 text-white"
						>
							等级 {playerData?.level || 1}
						</Badge>
					</div>
					<Card className="bg-white shadow-lg">
						<CardHeader>
							<CardTitle className="text-2xl text-purple-600">
								总体进度
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Progress
								value={((playerData?.exp || 0) / 1000) * 100}
								className="h-4"
							/>
							<p className="text-sm text-gray-600 mt-2">
								经验值: {playerData?.exp || 0} / 1000
							</p>
						</CardContent>
					</Card>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{levels.map((level) => (
							<motion.div
								key={level.id}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Card
									className={`${level.color} text-white shadow-lg overflow-hidden`}
								>
									<CardHeader className="pb-2">
										<CardTitle className="flex items-center justify-between text-xl">
											<span>{level.name}</span>
											{React.createElement(level.icon, {
												className: "h-8 w-8",
											})}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-sm mb-4">{level.description}</p>
										<Progress
											value={
												((playerData?.completedChallenges?.filter((c) =>
													c.startsWith(`${level.id}-`),
												).length || 0) /
													level.challenges.length) *
												100
											}
											className="h-2 bg-white bg-opacity-30"
										/>
									</CardContent>
									<CardFooter>
										<Button
											className="w-full bg-white text-black hover:bg-opacity-90 transition-colors duration-200"
											onClick={() => startLevel(level.id)}
										>
											<Play className="mr-2 h-4 w-4" /> 开始挑战
										</Button>
									</CardFooter>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</main>
		</div>
	);

	const renderLevelChallenge = () => {
		const level = levels.find((l) => l.id === currentLevel);
		const challenge = level?.challenges.find((c) => c.id === currentChallenge);

		return (
			<div className="flex h-screen bg-gray-100">
				{renderSidebar()}
				<main className="flex-1 p-8 overflow-auto">
					<div className="max-w-4xl mx-auto space-y-8">
						<div className="flex items-center justify-between">
							<Button
								variant="ghost"
								onClick={() => setGameState("worldMap")}
								className="text-purple-600"
							>
								<ArrowLeft className="mr-2 h-5 w-5" /> 返回世界地图
							</Button>
							<Badge
								variant="secondary"
								className="text-lg py-2 px-4 bg-purple-500 text-white"
							>
								{level?.name} - 挑战 {currentChallenge}/
								{level?.challenges.length}
							</Badge>
						</div>
						<Card className={`${level?.color} text-white shadow-lg`}>
							<CardHeader>
								<CardTitle className="text-2xl">{challenge?.name}</CardTitle>
								<CardDescription className="text-lg text-white opacity-80">
									{challenge?.description}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="bg-white bg-opacity-20 rounded-lg p-6">
									<h3 className="text-xl font-semibold mb-4">你的任务：</h3>
									<p className="text-lg mb-6">{challenge?.task}</p>
									<textarea
										className="w-full h-32 p-2 text-black rounded-md"
										placeholder="在这里输入你的 Prompt..."
									/>
								</div>
							</CardContent>
							<CardFooter className="flex justify-between">
								<Button
									variant="secondary"
									onClick={() => setGameState("worldMap")}
								>
									退出挑战
								</Button>
								<Button
									className="bg-white text-black hover:bg-opacity-90"
									onClick={() => handleLevelComplete(100)}
								>
									提交 Prompt
								</Button>
							</CardFooter>
						</Card>
					</div>
				</main>
			</div>
		);
	};

	const renderLeaderboard = () => (
		<div className="flex h-screen bg-gray-100">
			{renderSidebar()}
			<main className="flex-1 p-8 overflow-auto">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl font-bold text-purple-600 mb-6">排行榜</h1>
					<Card className="bg-white shadow-lg">
						<CardContent className="p-6">
							<ScrollArea className="h-[600px]">
								{leaderboard.map((player, index) => (
									<div
										key={player.rank}
										className="flex items-center justify-between py-4 border-b last:border-b-0"
									>
										<div className="flex items-center">
											<span className="font-bold mr-4 text-2xl text-purple-500">
												#{index + 1}
											</span>
											<Avatar className="w-12 h-12 mr-4">
												<AvatarImage src={player.avatar} alt={player.name} />
												<AvatarFallback>
													{player.name ? player.name[0] : "P"}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="font-semibold text-lg">{player.name}</p>
												<p className="text-sm text-gray-500">
													等级 {player.level}
												</p>
											</div>
										</div>
										<Badge
											variant="secondary"
											className="text-lg py-2 px-4 bg-purple-500 text-white"
										>
											{player.score} 分
										</Badge>
									</div>
								))}
							</ScrollArea>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);

	const renderAchievements = () => (
		<div className="flex h-screen bg-gray-100">
			{renderSidebar()}
			<main className="flex-1 p-8 overflow-auto">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl font-bold text-purple-600 mb-6">成就</h1>
					<Card className="bg-white shadow-lg">
						<CardContent className="p-6">
							<ScrollArea className="h-[600px]">
								{achievements.map((achievement) => (
									<div
										key={achievement.id}
										className="flex items-center justify-between py-4 border-b last:border-b-0"
									>
										<div>
											<p className="font-semibold text-lg">
												{achievement.name}
											</p>
										</div>
										<Badge
											variant={achievement.unlocked ? "default" : "secondary"}
											className={`text-lg py-2 px-4 ${achievement.unlocked ? "bg-green-500" : "bg-gray-500"} text-white`}
										>
											{achievement.unlocked ? "已解锁" : "未解锁"}
										</Badge>
									</div>
								))}
							</ScrollArea>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500">
				<div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-white" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<AnimatePresence mode="wait">
				<motion.div
					key={gameState}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.3 }}
				>
					{gameState === "mainMenu" && renderMainMenu()}
					{gameState === "characterCreation" && (
						<CharacterCustomization onComplete={handleCharacterCreation} />
					)}
					{gameState === "worldMap" && renderWorldMap()}
					{gameState === "levelChallenge" && renderLevelChallenge()}
					{gameState === "leaderboard" && renderLeaderboard()}
					{gameState === "achievements" && renderAchievements()}
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
