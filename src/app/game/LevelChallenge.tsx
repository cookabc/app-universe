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
import { motion } from "framer-motion";
import { ChevronRight, Clock } from "lucide-react";
import { useState } from "react";
import type { Challenge } from "../interfaces";
import PromptChallenge from "./PromptChallenge";

interface LevelChallengeProps {
	levelId: number;
	onComplete: (score: number) => void;
	onExit: () => void;
}

const challenges: { [key: number]: Challenge[] } = {
	1: [
		{
			id: 1,
			type: "text-completion",
			title: "基础总结挑战",
			description: "创建一个Prompt，生成关于Prompt Engineering的简短总结。",
			initialPrompt: "请简要总结Prompt Engineering的概念。",
			targetOutput:
				"Prompt Engineering是优化AI模型输入以获得更好输出的技术。它涉及设计、构建和优化提示，以提高AI系统的性能和准确性。",
		},
		{
			id: 2,
			type: "multiple-choice",
			title: "Prompt类型识别",
			description: "识别下面Prompt的类型。",
			initialPrompt: "将以下文本翻译成法语：'Hello, how are you?'",
			options: ["开放式生成", "指令遵循", "文本翻译", "情感分析"],
			correctAnswer: "文本翻译",
		},
		{
			id: 3,
			type: "prompt-improvement",
			title: "Prompt改进挑战",
			description: "改进以下Prompt以获得更好的结果。",
			initialPrompt: "告诉我关于气候变化。",
			targetOutput:
				"请提供一个关于气候变化的简明概述，包括其主要原因、潜在影响和可能的解决方案。请使用可靠的科学数据支持你的解释，并以通俗易懂的语言呈现信息。",
		},
	],
	// 可以为其他关卡添加更多挑战
};

export default function LevelChallenge({
	levelId,
	onComplete,
	onExit,
}: LevelChallengeProps) {
	const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
	const [totalScore, setTotalScore] = useState(0);
	const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes for the whole level

	const currentChallenge = challenges[levelId]
		? challenges[levelId][currentChallengeIndex]
		: null;

	const handleChallengeComplete = (score: number) => {
		setTotalScore((prevScore) => prevScore + score);
		if (
			currentChallenge &&
			currentChallengeIndex < challenges[levelId].length - 1
		) {
			setCurrentChallengeIndex((prevIndex) => prevIndex + 1);
		} else {
			onComplete(totalScore);
		}
	};

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle>关卡 {levelId}</CardTitle>
				<CardDescription>完成所有挑战以通过此关卡</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex justify-between items-center">
					<div className="flex items-center">
						<Clock className="mr-2 h-4 w-4" />
						<span>
							{Math.floor(timeLeft / 60)}:
							{(timeLeft % 60).toString().padStart(2, "0")}
						</span>
					</div>
					<Progress
						value={
							((currentChallengeIndex + 1) / challenges[levelId].length) * 100
						}
						className="w-1/2"
					/>
				</div>
				{currentChallenge && (
					<motion.div
						key={currentChallengeIndex}
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -50 }}
						transition={{ duration: 0.5 }}
					>
						<PromptChallenge
							challenge={currentChallenge}
							onComplete={handleChallengeComplete}
						/>
					</motion.div>
				)}
				{currentChallengeIndex < challenges[levelId].length - 1 && (
					<Button
						onClick={() =>
							setCurrentChallengeIndex((prevIndex) => prevIndex + 1)
						}
						className="w-full"
					>
						下一个挑战 <ChevronRight className="ml-2 h-4 w-4" />
					</Button>
				)}
				<Button variant="outline" onClick={onExit} className="w-full">
					退出关卡
				</Button>
			</CardContent>
		</Card>
	);
}
