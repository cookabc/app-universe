"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

// New improved SVG Logo component
const Logo = () => (
	<svg
		width="40"
		height="40"
		viewBox="0 0 40 40"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<title>Social Media Aggregator</title>
		<rect width="40" height="40" rx="8" fill="url(#gradient)" />
		<path d="M20 8L28 12V20L20 24L12 20V12L20 8Z" fill="white" />
		<path d="M20 24V32" stroke="white" strokeWidth="2" strokeLinecap="round" />
		<path
			d="M28 20L32 22"
			stroke="white"
			strokeWidth="2"
			strokeLinecap="round"
		/>
		<path
			d="M12 20L8 22"
			stroke="white"
			strokeWidth="2"
			strokeLinecap="round"
		/>
		<circle cx="20" cy="20" r="4" fill="white" />
		<defs>
			<linearGradient
				id="gradient"
				x1="0"
				y1="0"
				x2="40"
				y2="40"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#6366F1" />
				<stop offset="1" stopColor="#8B5CF6" />
			</linearGradient>
		</defs>
	</svg>
);

// X (Twitter) icon component
const XIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<title>X</title>
		<path
			d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
			fill="currentColor"
		/>
	</svg>
);

// Weibo icon component
const WeiboIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<title>微博</title>
		<path
			d="M15.75 4.5a3 3 0 11-6 0 3 3 0 016 0zm-6 12a3 3 0 100-6 3 3 0 000 6zm9-6a3 3 0 11-6 0 3 3 0 016 0zm-3 6a3 3 0 100-6 3 3 0 000 6z"
			fill="currentColor"
		/>
	</svg>
);

interface Post {
	id: number;
	user: {
		name: string;
		username: string;
		avatar: string;
	};
	content: string;
	likes: number;
	retweets?: number;
	reposts?: number;
	comments: number;
}

// 模拟数据
const mockXPosts: Post[] = [
	{
		id: 1,
		user: {
			name: "John Doe",
			username: "johndoe",
			avatar: "/placeholder-user.jpg",
		},
		content: "这是一条来自X的示例推文。#SocialMediaAggregator",
		likes: 10,
		retweets: 5,
		comments: 3,
	},
	{
		id: 2,
		user: {
			name: "Jane Smith",
			username: "janesmith",
			avatar: "/placeholder-user-2.jpg",
		},
		content: "使用社交媒体聚合器让管理变得如此简单！",
		likes: 15,
		retweets: 7,
		comments: 2,
	},
	{
		id: 3,
		user: {
			name: "Tech News",
			username: "technews",
			avatar: "/placeholder-user-3.jpg",
		},
		content: "最新科技新闻：人工智能在医疗领域取得重大突破！",
		likes: 100,
		retweets: 50,
		comments: 20,
	},
];

const mockWeiboPosts: Post[] = [
	{
		id: 1,
		user: {
			name: "张三",
			username: "zhangsan",
			avatar: "/placeholder-user-4.jpg",
		},
		content: "这是一条来自微博的示例微博。#社交媒体聚合器",
		likes: 20,
		reposts: 8,
		comments: 5,
	},
	{
		id: 2,
		user: { name: "李四", username: "lisi", avatar: "/placeholder-user-5.jpg" },
		content: "社交媒体聚合器真是太方便了！",
		likes: 25,
		reposts: 10,
		comments: 7,
	},
	{
		id: 3,
		user: {
			name: "娱乐新闻",
			username: "entertainment",
			avatar: "/placeholder-user-6.jpg",
		},
		content: "重磅！某知名演员宣布退出娱乐圈，转型做公益！",
		likes: 500,
		reposts: 200,
		comments: 150,
	},
];

export default function HomePage() {
	const [activeTab, setActiveTab] = useState("x");
	const [isXAuthenticated, setIsXAuthenticated] = useState(false);
	const [isWeiboAuthenticated, setIsWeiboAuthenticated] = useState(false);
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
	const [xPosts, setXPosts] = useState<Post[]>([]);
	const [weiboPosts, setWeiboPosts] = useState<Post[]>([]);
	const { toast } = useToast();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	useEffect(() => {
		if (isXAuthenticated) {
			setXPosts(mockXPosts);
		} else {
			setXPosts([]);
		}
	}, [isXAuthenticated]);

	useEffect(() => {
		if (isWeiboAuthenticated) {
			setWeiboPosts(mockWeiboPosts);
		} else {
			setWeiboPosts([]);
		}
	}, [isWeiboAuthenticated]);

	const handleLogin = (e: { preventDefault: () => void }) => {
		e.preventDefault();
		if (username && password) {
			if (activeTab === "x") {
				setIsXAuthenticated(true);
			} else {
				setIsWeiboAuthenticated(true);
			}
			toast({
				title: "登录成功",
				description: `欢迎回来，${username}！您已登录到 ${activeTab === "x" ? "X" : "微博"}。`,
			});
		} else {
			toast({
				title: "登录失败",
				description: "请输入用户名和密码。",
				variant: "destructive",
			});
		}
	};

	const handleLogout = () => {
		if (activeTab === "x") {
			setIsXAuthenticated(false);
		} else {
			setIsWeiboAuthenticated(false);
		}
		setUsername("");
		setPassword("");
		toast({
			title: "已登出",
			description: "期待您的再次登录！",
		});
	};

	const toggleSidebar = () => {
		setIsSidebarCollapsed(!isSidebarCollapsed);
	};

	return (
		<div className="flex flex-col h-screen">
			{/* Sidebar - hidden on mobile */}
			<aside
				className={`bg-white shadow-md transition-all duration-300 ${isSidebarCollapsed ? "w-16" : "w-64"} flex flex-col justify-between fixed top-0 left-0 h-full z-50 lg:relative lg:translate-x-0 ${isSidebarCollapsed ? "-translate-x-full" : ""}`}
			>
				<div>
					<div className="p-4 flex justify-between items-center">
						{!isSidebarCollapsed && <Logo />}
						<Button
							variant="ghost"
							size="icon"
							onClick={toggleSidebar}
							className="lg:hidden"
						>
							{isSidebarCollapsed ? (
								<ChevronRight className="h-4 w-4" />
							) : (
								<ChevronLeft className="h-4 w-4" />
							)}
						</Button>
					</div>
					<nav className="space-y-2 p-2">
						<Button
							variant="ghost"
							className={`w-full justify-start ${isSidebarCollapsed ? "px-2" : ""}`}
							onClick={() => setActiveTab("x")}
						>
							<XIcon />
							{!isSidebarCollapsed && <span className="ml-2">X</span>}
						</Button>
						<Button
							variant="ghost"
							className={`w-full justify-start ${isSidebarCollapsed ? "px-2" : ""}`}
							onClick={() => setActiveTab("weibo")}
						>
							<WeiboIcon />
							{!isSidebarCollapsed && <span className="ml-2">微博</span>}
						</Button>
					</nav>
				</div>
				{(isXAuthenticated || isWeiboAuthenticated) && (
					<div className="p-2">
						<Button onClick={handleLogout} className="w-full justify-start">
							<LogOut className="h-4 w-4" />
							{!isSidebarCollapsed && <span className="ml-2">登出</span>}
						</Button>
					</div>
				)}
			</aside>

			{/* Main content */}
			<main className="flex-1 p-6 overflow-auto bg-gray-100 lg:ml-16 pb-24">
				<div className="max-w-4xl mx-auto space-y-6">
					{/* Content for X and Weibo */}
					<div className="space-y-4">
						{activeTab === "x" &&
							(!isXAuthenticated ? (
								<Dialog>
									<DialogTrigger asChild>
										<Button className="w-full mb-4">登录到 X</Button>
									</DialogTrigger>
									<DialogContent className="sm:max-w-[425px]">
										<DialogHeader>
											<DialogTitle>登录到 X</DialogTitle>
											<DialogDescription>
												请输入您的用户名和密码登录您的 X 账户。
											</DialogDescription>
										</DialogHeader>
										<form onSubmit={handleLogin}>
											<div className="grid gap-4 py-4">
												<div className="grid grid-cols-4 items-center gap-4">
													<Label htmlFor="username" className="text-right">
														用户名
													</Label>
													<Input
														id="username"
														value={username}
														onChange={(e) => setUsername(e.target.value)}
														className="col-span-3"
													/>
												</div>
												<div className="grid grid-cols-4 items-center gap-4">
													<Label htmlFor="password" className="text-right">
														密码
													</Label>
													<Input
														id="password"
														type="password"
														value={password}
														onChange={(e) => setPassword(e.target.value)}
														className="col-span-3"
													/>
												</div>
											</div>
											<DialogFooter>
												<Button type="submit">登录</Button>
											</DialogFooter>
										</form>
									</DialogContent>
								</Dialog>
							) : (
								xPosts.map((post) => (
									<Card key={post.id} className="mb-4">
										<CardHeader className="flex items-center space-x-4">
											<Avatar>
												<AvatarImage
													src={post.user.avatar}
													alt={`@${post.user.username}`}
												/>
												<AvatarFallback>
													{post.user.name.charAt(0)}
												</AvatarFallback>
											</Avatar>
											<div>
												<h3 className="font-bold">{post.user.name}</h3>
												<p className="text-sm text-gray-500">
													@{post.user.username}
												</p>
											</div>
										</CardHeader>
										<CardContent>
											<p>{post.content}</p>
										</CardContent>
										<CardFooter className="flex justify-between">
											<Button variant="ghost" size="sm">
												点赞 ({post.likes})
											</Button>
											<Button variant="ghost" size="sm">
												转发 ({post.retweets})
											</Button>
											<Button variant="ghost" size="sm">
												评论 ({post.comments})
											</Button>
										</CardFooter>
									</Card>
								))
							))}
						{activeTab === "weibo" &&
							(!isWeiboAuthenticated ? (
								<Dialog>
									<DialogTrigger asChild>
										<Button className="w-full mb-4">登录到微博</Button>
									</DialogTrigger>
									<DialogContent className="sm:max-w-[425px]">
										<DialogHeader>
											<DialogTitle>登录到微博</DialogTitle>
											<DialogDescription>
												请输入您的用户名和密码登录您的微博账户。
											</DialogDescription>
										</DialogHeader>
										<form onSubmit={handleLogin}>
											<div className="grid gap-4 py-4">
												<div className="grid grid-cols-4 items-center gap-4">
													<Label htmlFor="username" className="text-right">
														用户名
													</Label>
													<Input
														id="username"
														value={username}
														onChange={(e) => setUsername(e.target.value)}
														className="col-span-3"
													/>
												</div>
												<div className="grid grid-cols-4 items-center gap-4">
													<Label htmlFor="password" className="text-right">
														密码
													</Label>
													<Input
														id="password"
														type="password"
														value={password}
														onChange={(e) => setPassword(e.target.value)}
														className="col-span-3"
													/>
												</div>
											</div>
											<DialogFooter>
												<Button type="submit">登录</Button>
											</DialogFooter>
										</form>
									</DialogContent>
								</Dialog>
							) : (
								weiboPosts.map((post) => (
									<Card key={post.id} className="mb-4">
										<CardHeader className="flex items-center space-x-4">
											<Avatar>
												<AvatarImage
													src={post.user.avatar}
													alt={`@${post.user.username}`}
												/>
												<AvatarFallback>
													{post.user.name.charAt(0)}
												</AvatarFallback>
											</Avatar>
											<div>
												<h3 className="font-bold">{post.user.name}</h3>
												<p className="text-sm text-gray-500">
													@{post.user.username}
												</p>
											</div>
										</CardHeader>
										<CardContent>
											<p>{post.content}</p>
										</CardContent>
										<CardFooter className="flex justify-between">
											<Button variant="ghost" size="sm">
												点赞 ({post.likes})
											</Button>
											<Button variant="ghost" size="sm">
												转发 ({post.reposts})
											</Button>
											<Button variant="ghost" size="sm">
												评论 ({post.comments})
											</Button>
										</CardFooter>
									</Card>
								))
							))}
					</div>
				</div>
			</main>

			{/* Bottom navigation for mobile */}
			<nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md">
				<div className="flex justify-around items-center h-16">
					<Button variant="ghost" onClick={() => setActiveTab("x")}>
						<XIcon />
					</Button>
					<Button variant="ghost" onClick={() => setActiveTab("weibo")}>
						<WeiboIcon />
					</Button>
				</div>
			</nav>

			{/* Floating login status toggle */}
			<div className="fixed bottom-20 right-4 bg-white p-2 rounded-lg shadow-md">
				<div className="flex items-center space-x-2">
					<Label htmlFor="auth-toggle">模拟登录状态</Label>
					<Switch
						id="auth-toggle"
						checked={
							activeTab === "x" ? isXAuthenticated : isWeiboAuthenticated
						}
						onCheckedChange={(checked) => {
							if (activeTab === "x") {
								setIsXAuthenticated(checked);
							} else {
								setIsWeiboAuthenticated(checked);
							}
						}}
					/>
				</div>
			</div>
		</div>
	);
}
