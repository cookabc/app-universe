"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { Award, BarChart2, ChevronRight, Clock, Star } from "lucide-react";
import { useEffect, useState } from "react";

const challenges = [
	{
		id: 1,
		title: "基础总结提示",
		description: "创建一个Prompt，生成关于Prompt Engineering的简短总结。",
		initialPrompt: "请简要总结Prompt Engineering的概念。",
		timeLimit: 180, // 3 minutes
		difficulty: "简单",
	},
	{
		id: 2,
		title: "个性化学习计划",
		description:
			"优化Prompt以生成针对初学者的个性化Prompt Engineering学习计划。",
		initialPrompt: "为Prompt Engineering初学者创建一个为期一周的学习计划。",
		timeLimit: 240, // 4 minutes
		difficulty: "中等",
	},
	{
		id: 3,
		title: "多语言翻译优化",
		description:
			"创建一个Prompt，使AI能够更准确地进行多语言翻译，特别是处理俚语和习语。",
		initialPrompt:
			"设计一个Prompt，使AI在翻译时能准确处理英语俚语到中文的转换。",
		timeLimit: 300, // 5 minutes
		difficulty: "中等",
	},
	{
		id: 4,
		title: "创意写作增强",
		description: "优化Prompt以生成更有创意和吸引力的故事开头。",
		initialPrompt: "创建一个Prompt，使AI生成一个科幻故事的引人入胜的开头段落。",
		timeLimit: 360, // 6 minutes
		difficulty: "困难",
	},
	{
		id: 5,
		title: "代码解释与优化",
		description: "设计一个Prompt，使AI能够解释复杂的代码片段并提供优化建议。",
		initialPrompt:
			"创建一个Prompt，使AI能够解释一段Python递归函数并提供优化建议。",
		timeLimit: 420, // 7 minutes
		difficulty: "困难",
	},
];

export default function ChallengePage() {
	const [currentChallenge, setCurrentChallenge] = useState(0);
	const [userPrompt, setUserPrompt] = useState(
		challenges[currentChallenge].initialPrompt,
	);
	const [score, setScore] = useState(0);
	const [timeLeft, setTimeLeft] = useState(
		challenges[currentChallenge].timeLimit,
	);
	const [attempts, setAttempts] = useState(0);
	const [feedback, setFeedback] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [showSummary, setShowSummary] = useState(false);

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const handleSubmit = () => {
		// 这里应该有一个API调用来评估Prompt的质量
		// 现在我们用一个模拟的评分系统
		const promptScore = Math.floor(Math.random() * 100);
		const timeBonus = Math.floor(
			(timeLeft / challenges[currentChallenge].timeLimit) * 50,
		);
		const totalScore = promptScore + timeBonus;

		setScore((prevScore) => prevScore + totalScore);
		setAttempts((prevAttempts) => prevAttempts + 1);
		setIsSubmitted(true);

		if (promptScore < 50) {
			setFeedback(
				"你的Prompt还需要改进。考虑以下几点：\n1. 使指令更具体\n2. 提供更多上下文\n3. 明确输出格式",
			);
		} else if (promptScore < 80) {
			setFeedback(
				"不错的尝试！你的Prompt已经很好了，但还可以更精确。考虑：\n1. 添加一些约束条件\n2. 指定目标受众\n3. 要求AI解释其推理过程",
			);
		} else {
			setFeedback(
				"太棒了！你的Prompt非常出色。它具有：\n1. 清晰的指令\n2. 充分的上下文\n3. 明确的输出要求\n4. 适当的约束",
			);
		}

		toast({
			title: "提交成功！",
			description: `你获得了 ${totalScore} 分！`,
		});
	};

	const handleNextChallenge = () => {
		if (currentChallenge < challenges.length - 1) {
			setCurrentChallenge((prev) => prev + 1);
			setUserPrompt(challenges[currentChallenge + 1].initialPrompt);
			setTimeLeft(challenges[currentChallenge + 1].timeLimit);
			setAttempts(0);
			setFeedback("");
			setIsSubmitted(false);
		} else {
			setShowSummary(true);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<h1 className="text-3xl font-bold text-center mb-8">
						Prompt工程师挑战
					</h1>
				</motion.div>

				<AnimatePresence mode="wait">
					{!showSummary ? (
						<motion.div
							key="challenge"
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -50 }}
							transition={{ duration: 0.5 }}
						>
							<Card className="mb-8">
								<CardHeader>
									<CardTitle>{challenges[currentChallenge].title}</CardTitle>
									<CardDescription>
										{challenges[currentChallenge].description}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="flex justify-between items-center mb-4">
										<div className="flex items-center">
											<Star className="text-yellow-500 mr-2" />
											<span className="font-bold">{score}分</span>
										</div>
										<div className="flex items-center">
											<Clock className="text-blue-500 mr-2" />
											<span className="font-bold">
												{Math.floor(timeLeft / 60)}:
												{(timeLeft % 60).toString().padStart(2, "0")}
											</span>
										</div>
									</div>
									<Progress
										value={((currentChallenge + 1) / challenges.length) * 100}
										className="mb-4"
									/>
									<div className="flex justify-between items-center mb-2">
										<span className="text-sm font-medium">
											难度：{challenges[currentChallenge].difficulty}
										</span>
										<span className="text-sm font-medium">
											挑战 {currentChallenge + 1}/{challenges.length}
										</span>
									</div>
									<Textarea
										placeholder="在这里输入你的Prompt..."
										value={userPrompt}
										onChange={(e) => setUserPrompt(e.target.value)}
										className="mb-4"
										rows={5}
									/>
									<Button
										onClick={handleSubmit}
										className="w-full mb-4"
										disabled={isSubmitted || timeLeft === 0}
									>
										提交Prompt
									</Button>
									{feedback && (
										<div
											className={`p-4 rounded-md mb-4 ${isSubmitted ? "bg-green-100" : "bg-yellow-100"}`}
										>
											<p className="font-semibold mb-2">反馈：</p>
											<p className="whitespace-pre-line">{feedback}</p>
										</div>
									)}
									<div className="flex justify-between items-center">
										<p className="text-sm text-gray-500">
											尝试次数: {attempts}
										</p>
										{isSubmitted && (
											<Button onClick={handleNextChallenge}>
												{currentChallenge === challenges.length - 1
													? "查看总结"
													: "下一个挑战"}{" "}
												<ChevronRight className="ml-2 h-4 w-4" />
											</Button>
										)}
									</div>
								</CardContent>
							</Card>
						</motion.div>
					) : (
						<motion.div
							key="summary"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5 }}
						>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center">
										<Award className="mr-2 h-6 w-6 text-yellow-500" />
										挑战完成！
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="mb-4">
										恭喜你完成了所有的挑战！你的最终得分是 {score} 分。
									</p>
									<div className="flex items-center justify-center mb-4">
										<BarChart2 className="h-24 w-24 text-blue-500" />
									</div>
									<p className="mb-4">
										你在Prompt工程方面展现出了卓越的技能。继续练习和实验，你会成为一名出色的Prompt工程师！
									</p>
									<Button className="w-full">返回主页</Button>
								</CardContent>
							</Card>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
