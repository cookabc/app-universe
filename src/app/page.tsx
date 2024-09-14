"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Book, Trophy, Users } from "lucide-react";
import Link from "next/link";

export default function Component() {
	const [characterName, setCharacterName] = useState("Prompt Explorer");

	const modules = [
		{
			title: "Inferring",
			description: "Learn to make inferences from given information",
			icon: <Sparkles className="h-6 w-6" />,
		},
		{
			title: "Summarizing",
			description: "Master the art of concise summarization",
			icon: <Book className="h-6 w-6" />,
		},
		{
			title: "Optimizing",
			description: "Enhance your prompts for better results",
			icon: <Trophy className="h-6 w-6" />,
		},
		{
			title: "Collaborating",
			description: "Work with others to solve complex problems",
			icon: <Users className="h-6 w-6" />,
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold text-center mb-8">
					Prompt Engineering Adventure
				</h1>

				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Welcome, {characterName}!</CardTitle>
						<CardDescription>
							Your journey to become a master Prompt Engineer begins here. Solve
							puzzles, overcome challenges, and unlock the power of AI!
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="mb-4">
							As a novice Prompt Explorer, you've been called upon to help the
							citizens of Promptopia. They're facing complex problems that only
							a skilled Prompt Engineer can solve. Are you ready for the
							challenge?
						</p>
						<Button>Begin Your Adventure</Button>
					</CardContent>
				</Card>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{modules.map((module, index) => (
						<Card key={index}>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									{module.icon}
									{module.title}
								</CardTitle>
								<CardDescription>{module.description}</CardDescription>
							</CardHeader>
							<CardContent>
								<Link href={`/learn/${module.title.toLowerCase()}`}>
									<Button variant="outline" className="w-full">
										Start Module
									</Button>
								</Link>
							</CardContent>
						</Card>
					))}
				</div>

				<div className="mt-8 flex justify-between">
					<Link href="/achievements">
						<Button variant="ghost">
							<Trophy className="mr-2 h-4 w-4" /> View Achievements
						</Button>
					</Link>
					<Badge variant="outline" className="text-sm">
						Current Level: Novice
					</Badge>
				</div>
			</div>
		</div>
	);
}
