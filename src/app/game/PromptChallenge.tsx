"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import type { Challenge } from "../interfaces";

interface PromptChallengeProps {
	challenge: Challenge;
	onComplete: (score: number) => void;
}

export default function PromptChallenge({
	challenge,
	onComplete,
}: PromptChallengeProps) {
	const [userInput, setUserInput] = useState("");
	const [selectedOption, setSelectedOption] = useState("");

	const handleSubmit = () => {
		let score = 0;
		switch (challenge.type) {
			case "text-completion":
				score =
					calculateSimilarity(userInput, challenge.targetOutput || "") * 100;
				break;
			case "multiple-choice":
				score = selectedOption === challenge.correctAnswer ? 100 : 0;
				break;
			case "prompt-improvement":
				score =
					evaluatePromptImprovement(userInput, challenge.initialPrompt) * 100;
				break;
		}

		onComplete(Math.round(score));
		toast({
			title: "挑战完成！",
			description: `你的得分是 ${Math.round(score)} 分！`,
		});
	};

	const calculateSimilarity = (str1: string, str2: string) => {
		// 这里应该使用更复杂的相似度算法，比如余弦相似度
		// 为了简化，我们使用一个基本的长度比较
		const lengthDiff = Math.abs(str1.length - str2.length);
		return 1 - lengthDiff / Math.max(str1.length, str2.length);
	};

	const evaluatePromptImprovement = (improved: string, original: string) => {
		// 这里应该使用更复杂的评估方法
		// 为了简化，我们比较改进后的提示是否比原始提示长，并且包含某些关键词
		const keyWords = ["具体", "明确", "步骤", "示例"];
		const score = improved.length > original.length ? 0.5 : 0;
		return (
			score + keyWords.filter((word) => improved.includes(word)).length * 0.125
		);
	};

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle>{challenge.title}</CardTitle>
				<CardDescription>{challenge.description}</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="initial-prompt">初始 Prompt</Label>
					<Input id="initial-prompt" value={challenge.initialPrompt} readOnly />
				</div>
				{challenge.type === "multiple-choice" ? (
					<RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
						{challenge.options?.map((option, index) => (
							<div key={option} className="flex items-center space-x-2">
								<RadioGroupItem value={option} id={`option-${index}`} />
								<Label htmlFor={`option-${index}`}>{option}</Label>
							</div>
						))}
					</RadioGroup>
				) : (
					<div className="space-y-2">
						<Label htmlFor="user-input">你的回答</Label>
						<Textarea
							id="user-input"
							placeholder="在这里输入你的回答..."
							value={userInput}
							onChange={(e) => setUserInput(e.target.value)}
							rows={4}
						/>
					</div>
				)}
				<Button onClick={handleSubmit} className="w-full">
					提交答案
				</Button>
			</CardContent>
		</Card>
	);
}
