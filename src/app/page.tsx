"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { BookOpen, Code, Brain, Zap } from "lucide-react";

export default function HomePage() {
	const modules = [
		{
			title: "指导准则",
			description: "学习Prompt工程的基本原则",
			icon: <BookOpen className="h-6 w-6" />,
		},
		{
			title: "提示开发",
			description: "掌握创建有效提示的技巧",
			icon: <Code className="h-6 w-6" />,
		},
		{
			title: "总结能力",
			description: "学习如何简明扼要地总结信息",
			icon: <Brain className="h-6 w-6" />,
		},
		{
			title: "推理能力",
			description: "培养逻辑推理和分析能力",
			icon: <Zap className="h-6 w-6" />,
		},
		{
			title: "转换能力",
			description: "学习如何转换信息的形式和格式",
			icon: <Zap className="h-6 w-6" />,
		},
		{
			title: "扩展能力",
			description: "掌握扩展和丰富内容的技巧",
			icon: <Zap className="h-6 w-6" />,
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
			<nav className="bg-white shadow-md">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex">
							<div className="flex-shrink-0 flex items-center">
								<span className="font-bold text-xl text-blue-600">
									Prompt工程师训练营
								</span>
							</div>
							<div className="hidden sm:ml-6 sm:flex sm:space-x-8">
								<Link
									href="/"
									className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
								>
									主页
								</Link>
								<Link
									href="/modules"
									className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
								>
									学习模块
								</Link>
								<Link
									href="/challenges"
									className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
								>
									挑战任务
								</Link>
								<Link
									href="/achievements"
									className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
								>
									成就
								</Link>
								<Link
									href="/leaderboard"
									className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
								>
									排行榜
								</Link>
							</div>
						</div>
					</div>
				</div>
			</nav>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						欢迎来到Prompt工程师训练营
					</h1>
					<p className="text-xl text-gray-600">
						帮助中小学生成为Prompt工程师，通过学习和游戏提升他们的知识和技能
					</p>
					<Button
						className="mt-8 px-8 py-3 text-lg"
						onClick={() => console.log("开始训练")}
					>
						开始训练
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{modules.map((module, index) => (
						<Card
							key={index}
							className="hover:shadow-lg transition-shadow duration-300"
						>
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
					))}
				</div>
			</main>

			<footer className="bg-white mt-12">
				<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
					<p className="text-center text-gray-500 text-sm">
						© 2023 Prompt工程师训练营. 保留所有权利.
					</p>
				</div>
			</footer>
		</div>
	);
}
