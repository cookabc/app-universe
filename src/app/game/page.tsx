"use client";

import { api } from "@/app/api/game/route";
import type { LeaderboardData, PlayerData } from "@/app/interfaces";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import {
	BarChart2,
	Book,
	CheckCircle,
	Lock,
	Play,
	Star,
	Trophy,
	Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import CharacterCustomization from "./CharacterCustomization";
import LevelChallenge from "./LevelChallenge";

const levels = [
	{
		id: 1,
		name: "Prompt 入门",
		description: "学习基础的 Prompt 编写技巧",
		icon: Book,
		challenges: [
			{ id: 1, name: "基础提示创建", description: "创建你的第一个AI提示" },
			{
				id: 2,
				name: "提示结构化",
				description: "学习如何结构化你的提示以获得更好的结果",
			},
			{
				id: 3,
				name: "上下文添加",
				description: "了解如何为你的提示添加有效的上下文",
			},
		],
	},
	{
		id: 2,
		name: "总结技能",
		description: "学习如何准确地总结长篇文章或数据",
		icon: BarChart2,
		challenges: [
			{ id: 1, name: "关键点提取", description: "从长文本中提取关键信息" },
			{ id: 2, name: "长文本压缩", description: "将长文本压缩成简洁的摘要" },
			{
				id: 3,
				name: "多源信息整合",
				description: "整合多个来源的信息生成综合摘要",
			},
		],
	},
	{
		id: 3,
		name: "推理任务",
		description: "学习如何从信息中推理出隐藏的内容",
		icon: Star,
		challenges: [
			{ id: 1, name: "逻辑推理", description: "基于给定信息进行逻辑推理" },
			{ id: 2, name: "隐含信息提取", description: "从文本中提取隐含的信息" },
			{ id: 3, name: "假设检验", description: "生成并验证基于给定信息的假设" },
		],
	},
	{
		id: 4,
		name: "转换技巧",
		description: "学习如何将原始数据转换成不同的语言或格式",
		icon: Trophy,
		challenges: [
			{ id: 1, name: "语言翻译", description: "使用AI进行准确的语言翻译" },
			{
				id: 2,
				name: "格式转换",
				description: "将数据从一种格式转换为另一种格式",
			},
			{ id: 3, name: "风格转换", description: "改变文本的写作风格" },
		],
	},
	{
		id: 5,
		name: "扩展任务",
		description: "学习如何通过 Prompt 生成更复杂的内容或任务",
		icon: Users,
		challenges: [
			{ id: 1, name: "创意写作", description: "使用AI生成创意故事或诗歌" },
			{ id: 2, name: "代码生成", description: "通过提示生成简单的代码片段" },
			{
				id: 3,
				name: "多步骤任务",
				description: "设计处理复杂、多步骤任务的提示",
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
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const initializeGame = async () => {
			setIsLoading(true);
			await loadPlayerData();
			await loadLeaderboard();
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

	const renderMainMenu = () => (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle className="text-2xl text-center">
					Prompt Engineering 冒险
				</CardTitle>
				<CardDescription className="text-center">
					成为最强大的提示工程师，拯救虚拟世界！
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col items-center space-y-4">
				{playerData && (
					<Avatar className="w-24 h-24">
						<AvatarImage src={playerData.avatar} alt={playerData.name} />
						<AvatarFallback>{playerData.name[0]}</AvatarFallback>
					</Avatar>
				)}
				<Button onClick={startGame} className="w-full">
					<Play className="mr-2 h-4 w-4" />{" "}
					{playerData ? "继续冒险" : "开始冒险"}
				</Button>
				<Button variant="outline" className="w-full">
					设置
				</Button>
			</CardContent>
		</Card>
	);

	const renderWorldMap = () => (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<span>世界地图</span>
						<Badge variant="secondary">
							{playerData?.name || "玩家"} - 等级 {playerData?.level || 1}
						</Badge>
					</CardTitle>
					<CardDescription>选择一个关卡开始你的冒险</CardDescription>
				</CardHeader>
				<CardContent>
					<Progress
						value={((playerData?.exp || 0) / 1000) * 100}
						className="mb-2"
					/>
					<p className="text-sm text-gray-500 mb-4">
						经验值: {playerData?.exp || 0} / 1000
					</p>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{levels.map((level) => (
							<Card
								key={level.id}
								className={`${playerData?.unlockedLevels?.includes(level.id) ? "bg-secondary" : "bg-muted"}`}
							>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span>{level.name}</span>
										{React.createElement(level.icon, { className: "h-6 w-6" })}
									</CardTitle>
									<CardDescription>{level.description}</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="list-disc list-inside space-y-1">
										{level.challenges.map((challenge) => (
											<li key={challenge.id} className="text-sm">
												{challenge.name}
												{playerData?.completedChallenges?.includes(
													`${level.id}-${challenge.id}`,
												) && (
													<CheckCircle className="inline-block ml-2 h-4 w-4 text-green-500" />
												)}
											</li>
										))}
									</ul>
								</CardContent>
								<CardFooter>
									<Button
										className="w-full"
										onClick={() => startLevel(level.id)}
										disabled={!playerData?.unlockedLevels?.includes(level.id)}
									>
										{playerData?.unlockedLevels?.includes(level.id) ? (
											<>
												<Play className="mr-2 h-4 w-4" /> 开始挑战
											</>
										) : (
											<>
												<Lock className="mr-2 h-4 w-4" /> 未解锁
											</>
										)}
									</Button>
								</CardFooter>
							</Card>
						))}
					</div>
				</CardContent>
			</Card>

			<Tabs defaultValue="skills">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="skills">技能树</TabsTrigger>
					<TabsTrigger value="achievements">成就</TabsTrigger>
					<TabsTrigger value="leaderboard">排行榜</TabsTrigger>
				</TabsList>
				<TabsContent value="skills">
					<Card>
						<CardHeader>
							<CardTitle>技能树</CardTitle>
							<CardDescription>
								提升你的 Prompt Engineering 技能
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ScrollArea className="h-[200px]">
								{playerData?.skills?.map((skill) => (
									<div
										key={skill.id}
										className="flex items-center justify-between mb-4"
									>
										<div>
											<p className="font-medium">{skill.name}</p>
										</div>
										<Badge variant="secondary">等级 {skill.level}</Badge>
									</div>
								)) || <p>暂无技能数据</p>}
							</ScrollArea>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="achievements">
					<Card>
						<CardHeader>
							<CardTitle>成就</CardTitle>
							<CardDescription>
								展示你的 Prompt Engineering 成就
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ScrollArea className="h-[200px]">
								{playerData?.achievements?.map((achievement) => (
									<div
										key={achievement.id}
										className="flex items-center justify-between mb-4"
									>
										<div>
											<p className="font-medium">{achievement.name}</p>
										</div>
										{achievement.unlocked ? (
											<Badge variant="default">已解锁</Badge>
										) : (
											<Badge variant="secondary">未解锁</Badge>
										)}
									</div>
								)) || <p>暂无成就数据</p>}
							</ScrollArea>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="leaderboard">
					<Card>
						<CardHeader>
							<CardTitle>排行榜</CardTitle>
							<CardDescription>查看全球最强 Prompt 工程师</CardDescription>
						</CardHeader>
						<CardContent>
							<ScrollArea className="h-[200px]">
								{leaderboard.map((player) => (
									<div
										key={player.rank}
										className="flex items-center justify-between mb-4"
									>
										<div className="flex items-center">
											<span className="font-bold mr-2">#{player.rank}</span>
											<Avatar className="w-8 h-8 mr-2">
												<AvatarImage src={player.avatar} alt={player.name} />
												<AvatarFallback>{player.name[0]}</AvatarFallback>
											</Avatar>
											<span>{player.name}</span>
										</div>
										<Badge variant="secondary">{player.score} 分</Badge>
									</div>
								))}
							</ScrollArea>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);

	const renderLevelChallenge = () => (
		<LevelChallenge
			levelId={currentLevel}
			challengeId={currentChallenge}
			onComplete={handleLevelComplete}
			onExit={() => setGameState("worldMap")}
		/>
	);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
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
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
}
