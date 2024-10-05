"use client";

import { LoginDialog } from "@/components/sm/LoginDialog";
import { PostCard } from "@/components/sm/PostCard";
import { PostDetailDialog } from "@/components/sm/PostDetailDialog";
import { WeiboIcon } from "@/components/sm/WeiboIcon";
import { XIcon } from "@/components/sm/XIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import type { Post } from "@/lib/mockData";
import { generateMockPosts } from "@/lib/mockData";
import { AnimatePresence, motion } from "framer-motion";
import { Loader, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function HomePage() {
	const [activeTab, setActiveTab] = useState<"x" | "weibo">("x");
	const [isXAuthenticated, setIsXAuthenticated] = useState(false);
	const [isWeiboAuthenticated, setIsWeiboAuthenticated] = useState(false);
	const [xPosts, setXPosts] = useState<Post[]>([]);
	const [weiboPosts, setWeiboPosts] = useState<Post[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [selectedPost, setSelectedPost] = useState<Post | null>(null);
	const observerRef = useRef<IntersectionObserver | null>(null);
	const loadMoreRef = useRef<HTMLDivElement>(null);
	const { toast } = useToast();

	const loadMorePosts = useCallback(() => {
		setIsLoading(true);
		setTimeout(() => {
			const newPosts = generateMockPosts(activeTab, 10);
			if (activeTab === "x") {
				setXPosts((prev) => [...prev, ...newPosts]);
			} else {
				setWeiboPosts((prev) => [...prev, ...newPosts]);
			}
			setIsLoading(false);
		}, 1000);
	}, [activeTab]);

	useEffect(() => {
		observerRef.current = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					loadMorePosts();
				}
			},
			{ threshold: 1.0 },
		);

		if (loadMoreRef.current) {
			observerRef.current.observe(loadMoreRef.current);
		}

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [loadMorePosts]);

	useEffect(() => {
		if (isXAuthenticated) {
			setXPosts(generateMockPosts("x", 20));
		} else {
			setXPosts([]);
		}
	}, [isXAuthenticated]);

	useEffect(() => {
		if (isWeiboAuthenticated) {
			setWeiboPosts(generateMockPosts("weibo", 20));
		} else {
			setWeiboPosts([]);
		}
	}, [isWeiboAuthenticated]);

	const handleLogin = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			const formData = new FormData(e.currentTarget);
			const username = formData.get("username") as string;
			const password = formData.get("password") as string;

			if (username && password) {
				if (activeTab === "x") {
					setIsXAuthenticated(true);
				} else {
					setIsWeiboAuthenticated(true);
				}
				toast({
					title: "Login Success",
					description: `Welcome back, ${username} to ${activeTab === "x" ? "X" : "Weibo"}.`,
				});
			} else {
				toast({
					title: "Login Failed",
					description: "Please enter your username and password.",
					variant: "destructive",
				});
			}
		},
		[activeTab, toast],
	);

	const filteredPosts = useCallback(
		(posts: Post[]) => {
			return posts.filter(
				(post) =>
					post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
					post.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					post.user.username.toLowerCase().includes(searchQuery.toLowerCase()),
			);
		},
		[searchQuery],
	);

	return (
		<div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
			{/* Main content */}
			<main className="flex-1 p-6 overflow-auto lg:ml-16 pb-24">
				<div className="max-w-4xl mx-auto space-y-6">
					{/* Search bar */}
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
						<Input
							type="text"
							placeholder="Search"
							className="pl-10 w-full"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					{/* Content for X and Weibo */}
					<div className="space-y-4">
						<AnimatePresence mode="wait">
							{activeTab === "x" && (
								<motion.div
									key="x-content"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.3 }}
								>
									{!isXAuthenticated ? (
										<LoginDialog platform="x" onSubmit={handleLogin} />
									) : (
										<>
											{filteredPosts(xPosts).map((post) => (
												<PostCard
													key={post.id}
													post={post}
													platform="x"
													onClick={() => setSelectedPost(post)}
												/>
											))}
											{isLoading && (
												<div className="flex justify-center items-center py-4">
													<Loader className="animate-spin" />
												</div>
											)}
											<div ref={loadMoreRef} />
										</>
									)}
								</motion.div>
							)}
							{activeTab === "weibo" && (
								<motion.div
									key="weibo-content"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.3 }}
								>
									{!isWeiboAuthenticated ? (
										<LoginDialog platform="weibo" onSubmit={handleLogin} />
									) : (
										<>
											{filteredPosts(weiboPosts).map((post) => (
												<PostCard
													key={post.id}
													post={post}
													platform="weibo"
													onClick={() => setSelectedPost(post)}
												/>
											))}
											{isLoading && (
												<div className="flex justify-center items-center py-4">
													<Loader className="animate-spin" />
												</div>
											)}
											<div ref={loadMoreRef} />
										</>
									)}
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</main>

			{/* Bottom navigation for mobile */}
			<nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md">
				<div className="flex justify-around items-center h-16">
					<Button
						variant={activeTab === "x" ? "default" : "ghost"}
						onClick={() => setActiveTab("x")}
						className="flex-1"
						aria-label="Switch to X"
					>
						<XIcon />
					</Button>
					<Button
						variant={activeTab === "weibo" ? "default" : "ghost"}
						onClick={() => setActiveTab("weibo")}
						className="flex-1"
						aria-label="Switch to Weibo"
					>
						<WeiboIcon />
					</Button>
				</div>
			</nav>

			{/* Floating login status toggle */}
			<div className="fixed bottom-20 right-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
				<div className="flex items-center space-x-2">
					<Label htmlFor="auth-toggle" className="text-sm font-medium">
						Simulate Login Status
					</Label>
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
						aria-label="Toggle Login Status"
					/>
				</div>
			</div>

			{/* Post detail dialog */}
			{selectedPost && (
				<PostDetailDialog
					post={selectedPost}
					platform={activeTab}
					onClose={() => setSelectedPost(null)}
				/>
			)}
		</div>
	);
}
