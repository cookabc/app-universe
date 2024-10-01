"use client";

import { type Message, continueConversation } from "@/app/actions";
import { readStreamableValue } from "ai/rsc";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Loader2, Send } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

export default function AIArtifacts() {
	const [input, setInput] = useState<string>("");
	const [conversation, setConversation] = useState<Message[]>([
		{
			role: "assistant",
			content: "Welcome to AI Artifacts Demo! How can I assist you today?",
		},
	]);
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		try {
			localStorage.setItem("chatMessages", JSON.stringify(conversation));
		} catch (err) {
			console.error("Failed to save messages to localStorage:", err);
		}
	}, [conversation]);

	useEffect(() => {
		try {
			const savedMessages = localStorage.getItem("chatMessages");
			if (savedMessages) {
				setConversation(JSON.parse(savedMessages));
			} else {
				// If no saved messages, keep the welcome message
				setConversation([
					{
						role: "assistant",
						content:
							"Welcome to AI Artifacts Demo! How can I assist you today?",
					},
				]);
			}
		} catch (err) {
			console.error("Failed to load messages from localStorage:", err);
		}
	}, []);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!input.trim()) return;
		setInput("");
		setError(null);

		startTransition(async () => {
			try {
				const { messages, newMessage } = await continueConversation([
					...conversation,
					{ role: "user", content: input },
				]);

				let textContent = "";

				for await (const delta of readStreamableValue(newMessage)) {
					textContent = `${textContent}${delta}`;

					setConversation([
						...messages,
						{ role: "assistant", content: textContent },
					]);
				}
			} catch (err) {
				console.error("Error in conversation:", err);
				setError(
					"An error occurred while processing your request. Please try again.",
				);
			}
		});
	};

	const exportChat = () => {
		const chatContent = conversation
			.map((m) => `${m.role}: ${m.content}`)
			.join("\n\n");
		const blob = new Blob([chatContent], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "chat_export.txt";
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<main className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
			<div className="flex flex-col h-screen bg-gradient-to-b from-blue-100 to-white p-4 sm:p-6">
				<div className="max-w-3xl w-full mx-auto flex flex-col flex-grow">
					<header className="flex justify-between items-center mb-4">
						<h1 className="text-3xl font-bold text-gray-800">
							AI Artifacts Demo
						</h1>
						{conversation.length > 0 && (
							<button
								type="button"
								onClick={exportChat}
								className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
								aria-label="Export chat"
							>
								<Download className="w-5 h-5 text-gray-600" />
							</button>
						)}
					</header>
					<div className="flex-grow overflow-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100">
						<AnimatePresence>
							{conversation.map((message, index) => (
								<motion.div
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									key={index}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.3 }}
									className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
								>
									<div
										className={`flex items-start space-x-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
									>
										{message.role === "user" ? (
											<svg
												className="w-10 h-10 rounded-full bg-blue-500 p-1"
												viewBox="0 0 40 40"
											>
												<title>User</title>
												<path
													fill="#fff"
													d="M20 21a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm10 5v1a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3v-1a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7z"
												/>
											</svg>
										) : (
											<svg
												className="w-10 h-10 rounded-full bg-green-500 p-1"
												viewBox="0 0 40 40"
											>
												<title>Assistant</title>
												<path
													fill="#fff"
													d="M20 30.5a10.5 10.5 0 1 1 0-21 10.5 10.5 0 0 1 0 21zm0-18.5a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 14a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
												/>
											</svg>
										)}
										<div
											className={`p-3 rounded-lg ${message.role === "user" ? "bg-blue-500 text-white" : "bg-white text-gray-800"} shadow-md`}
										>
											<p className="whitespace-pre-wrap">{message.content}</p>
										</div>
									</div>
								</motion.div>
							))}
						</AnimatePresence>
					</div>
					{error && <div className="text-red-500 mb-4">{error}</div>}
					<form onSubmit={handleSubmit} className="flex space-x-2">
						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="Type your message..."
							className="flex-grow p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
							disabled={isPending}
						/>
						<button
							type="submit"
							disabled={isPending}
							className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
						>
							{isPending ? (
								<Loader2 className="w-6 h-6 animate-spin" />
							) : (
								<Send className="w-6 h-6" />
							)}
						</button>
					</form>
				</div>
			</div>
		</main>
	);
}
