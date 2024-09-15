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
import { motion } from "framer-motion";
import { Award, ChevronRight, Clock, Star } from "lucide-react";
import { useEffect, useState } from "react";

const challenges = [
	{
		id: 1,
		title: "优化总结提示",
		description:
			"你需要优化以下Prompt，使其生成一个准确、简洁的Prompt Engineering总结。",
		initialPrompt: "请解释什么是Prompt Engineering",
		timeLimit: 300, // 5 minutes
	},
	{
		id: 2,
		title: "创建个性化学习计划",
		description:
			"优化Prompt以生成一个针对初学者的个性化Prompt Engineering学习计划。",
		initialPrompt: "给我一个学习Prompt Engineering的计划",
		timeLimit: 360, // 6 minutes
	},
	// 可以添加更多挑战
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
			setFeedback("你的Prompt还需要改进。试着让它更具体、更清晰。");
		} else if (promptScore < 80) {
			setFeedback("不错的尝试！你的Prompt已经很好了，但还可以更精确。");
		} else {
			setFeedback("太棒了！你的Prompt非常出色，简洁而有效。");
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
			toast({
				title: "恭喜！",
				description: "你已经完成了所有挑战！",
			});
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
								<p className="font-semibold">{feedback}</p>
							</div>
						)}
						<div className="flex justify-between items-center">
							<p className="text-sm text-gray-500">尝试次数: {attempts}</p>
							{isSubmitted && (
								<Button
									onClick={handleNextChallenge}
									disabled={currentChallenge === challenges.length - 1}
								>
									下一个挑战 <ChevronRight className="ml-2 h-4 w-4" />
								</Button>
							)}
						</div>
					</CardContent>
				</Card>

				{currentChallenge === challenges.length - 1 && isSubmitted && (
					<motion.div
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
								<Button className="w-full">返回主页</Button>
							</CardContent>
						</Card>
					</motion.div>
				)}
			</div>
		</div>
	);
}
