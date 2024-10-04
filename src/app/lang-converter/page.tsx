"use client";

import { japaneseConvert, translateText } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";
import {
	AlertCircle,
	ArrowLeftRight,
	Check,
	Copy,
	Moon,
	RotateCcw,
	Sun,
	Volume2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const languages = {
	en: {
		title: "Advanced Language Converter",
		inputPlaceholder: "Enter text here...",
		convertButton: "Convert!",
		loading: "Converting...",
		result: "Result:",
		history: "Conversion History",
		clearHistory: "Clear History",
		error: "Error",
		languageOptions: [
			{ value: "en", label: "English" },
			{ value: "ja", label: "Japanese" },
			{ value: "zh", label: "Chinese" },
		],
		japaneseOptions: [
			{ value: "hiragana", label: "Hiragana" },
			{ value: "katakana", label: "Katakana" },
			{ value: "kanji", label: "Kanji" },
			{ value: "romaji", label: "Romaji" },
		],
		tabs: {
			translation: "Translation",
			japaneseConversion: "Japanese Conversion",
		},
	},
	ja: {
		title: "高度言語変換ツール",
		inputPlaceholder: "ここにテキストを入力...",
		convertButton: "変換！",
		loading: "変換中...",
		result: "結果:",
		history: "変換履歴",
		clearHistory: "履歴をクリア",
		error: "エラー",
		languageOptions: [
			{ value: "en", label: "英語" },
			{ value: "ja", label: "日本語" },
			{ value: "zh", label: "中国語" },
		],
		japaneseOptions: [
			{ value: "hiragana", label: "ひらがな" },
			{ value: "katakana", label: "カタカナ" },
			{ value: "kanji", label: "漢字" },
			{ value: "romaji", label: "ローマ字" },
		],
		tabs: {
			translation: "翻訳",
			japaneseConversion: "日本語変換",
		},
	},
	zh: {
		title: "高级语言转换工具",
		inputPlaceholder: "在此输入文本...",
		convertButton: "转换！",
		loading: "转换中...",
		result: "结果：",
		history: "转换历史",
		clearHistory: "清除历史",
		error: "错误",
		languageOptions: [
			{ value: "en", label: "英语" },
			{ value: "ja", label: "日语" },
			{ value: "zh", label: "中文" },
		],
		japaneseOptions: [
			{ value: "hiragana", label: "平假名" },
			{ value: "katakana", label: "片假名" },
			{ value: "kanji", label: "汉字" },
			{ value: "romaji", label: "罗马字" },
		],
		tabs: {
			translation: "翻译",
			japaneseConversion: "日语转换",
		},
	},
};

const AppIcon = () => (
	<svg
		width="40"
		height="40"
		viewBox="0 0 40 40"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<title>Language Converter Icon</title>
		<rect width="40" height="40" rx="8" fill="#3B82F6" />
		<path
			d="M10 20C10 14.4772 14.4772 10 20 10C25.5228 10 30 14.4772 30 20C30 25.5228 25.5228 30 20 30C14.4772 30 10 25.5228 10 20Z"
			fill="white"
		/>
		<path
			d="M15 18H25M15 22H25"
			stroke="#3B82F6"
			strokeWidth="2"
			strokeLinecap="round"
		/>
		<path
			d="M20 13V27"
			stroke="#3B82F6"
			strokeWidth="2"
			strokeLinecap="round"
		/>
		<path
			d="M17 15L23 25"
			stroke="#3B82F6"
			strokeWidth="2"
			strokeLinecap="round"
		/>
		<path
			d="M23 15L17 25"
			stroke="#3B82F6"
			strokeWidth="2"
			strokeLinecap="round"
		/>
	</svg>
);

const speakText = (text: string, lang: string) => {
	const utterance = new SpeechSynthesisUtterance(text);
	utterance.lang = lang;
	window.speechSynthesis.speak(utterance);
};

export default function App() {
	const [inputText, setInputText] = useState("");
	const [outputText, setOutputText] = useState("");
	const [fromLang, setFromLang] = useState("en");
	const [toLang, setToLang] = useState("ja");
	const [fromType, setFromType] = useState("hiragana");
	const [toType, setToType] = useState("romaji");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [history, setHistory] = useState<
		Array<{
			id: string;
			input: string;
			output: string;
			from: string;
			to: string;
			mode: string;
		}>
	>([]);
	const [copied, setCopied] = useState(false);
	const { theme, setTheme } = useTheme();
	const [uiLanguage, setUiLanguage] = useState<"en" | "ja" | "zh">("en");
	const [activeTab, setActiveTab] = useState("translation");

	useEffect(() => {
		const savedHistory = localStorage.getItem("conversionHistory");
		if (savedHistory) {
			setHistory(JSON.parse(savedHistory));
		}
	}, []);

	const convertText = async () => {
		if (!inputText.trim()) {
			setError(languages[uiLanguage].inputPlaceholder);
			return;
		}

		setIsLoading(true);
		setError(null);
		setOutputText("");

		try {
			let result: string;
			if (activeTab === "translation") {
				result = await translateText(inputText, fromLang, toLang);
			} else {
				result = await japaneseConvert(inputText, fromType, toType);
			}
			setOutputText(result);
			const newHistory = [
				{
					id: Date.now().toString(),
					input: inputText,
					output: result,
					from: activeTab === "translation" ? fromLang : fromType,
					to: activeTab === "translation" ? toLang : toType,
					mode: activeTab,
				},
				...history.slice(0, 9),
			];
			setHistory(newHistory);
			localStorage.setItem("conversionHistory", JSON.stringify(newHistory));
		} catch (err) {
			console.error("Error details:", err);
			setError(
				`${languages[uiLanguage].error}: ${err instanceof Error ? err.message : "Unknown error"}`,
			);
		} finally {
			setIsLoading(false);
		}
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(outputText);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const clearHistory = () => {
		setHistory([]);
		localStorage.removeItem("conversionHistory");
	};

	const switchLanguages = () => {
		if (activeTab === "translation") {
			const temp = fromLang;
			setFromLang(toLang);
			setToLang(temp);
		} else {
			const temp = fromType;
			setFromType(toType);
			setToType(temp);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
			<div className="container mx-auto p-4 max-w-2xl">
				<div className="flex justify-between items-center mb-8">
					<div className="flex items-center space-x-4">
						<AppIcon />
						<h1
							className="text-4xl font-bold"
							style={{ fontFamily: "'Bangers', cursive" }}
						>
							{languages[uiLanguage].title}
						</h1>
					</div>
					<div className="flex items-center space-x-2">
						<Select
							value={uiLanguage}
							onValueChange={(value: "en" | "ja" | "zh") =>
								setUiLanguage(value)
							}
						>
							<SelectTrigger className="w-[100px]">
								<SelectValue placeholder="Language" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="en">English</SelectItem>
								<SelectItem value="ja">日本語</SelectItem>
								<SelectItem value="zh">中文</SelectItem>
							</SelectContent>
						</Select>
						<Button
							variant="outline"
							size="icon"
							onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
						>
							{theme === "dark" ? (
								<Sun className="h-[1.2rem] w-[1.2rem]" />
							) : (
								<Moon className="h-[1.2rem] w-[1.2rem]" />
							)}
						</Button>
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border-4 border-blue-500">
					<Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="translation">
								{languages[uiLanguage].tabs.translation}
							</TabsTrigger>
							<TabsTrigger value="japaneseConversion">
								{languages[uiLanguage].tabs.japaneseConversion}
							</TabsTrigger>
						</TabsList>
						<TabsContent value="translation">
							<div className="flex justify-between items-center mb-4">
								<Select value={fromLang} onValueChange={setFromLang}>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="From" />
									</SelectTrigger>
									<SelectContent>
										{languages[uiLanguage].languageOptions.map((lang) => (
											<SelectItem key={lang.value} value={lang.value}>
												{lang.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Button variant="outline" size="icon" onClick={switchLanguages}>
									<ArrowLeftRight className="h-4 w-4" />
								</Button>
								<Select value={toLang} onValueChange={setToLang}>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="To" />
									</SelectTrigger>
									<SelectContent>
										{languages[uiLanguage].languageOptions.map((lang) => (
											<SelectItem key={lang.value} value={lang.value}>
												{lang.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</TabsContent>
						<TabsContent value="japaneseConversion">
							<div className="flex justify-between items-center mb-4">
								<Select value={fromType} onValueChange={setFromType}>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="From" />
									</SelectTrigger>
									<SelectContent>
										{languages[uiLanguage].japaneseOptions.map((type) => (
											<SelectItem key={type.value} value={type.value}>
												{type.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Button variant="outline" size="icon" onClick={switchLanguages}>
									<ArrowLeftRight className="h-4 w-4" />
								</Button>
								<Select value={toType} onValueChange={setToType}>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="To" />
									</SelectTrigger>
									<SelectContent>
										{languages[uiLanguage].japaneseOptions.map((type) => (
											<SelectItem key={type.value} value={type.value}>
												{type.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</TabsContent>
					</Tabs>

					<Textarea
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						placeholder={languages[uiLanguage].inputPlaceholder}
						className="w-full mb-4 text-lg"
						rows={4}
					/>

					<Button
						onClick={convertText}
						disabled={isLoading || !inputText.trim()}
						className="w-full mb-4 text-lg bg-blue-500 hover:bg-blue-600 text-white"
					>
						{isLoading
							? languages[uiLanguage].loading
							: languages[uiLanguage].convertButton}
					</Button>

					<AnimatePresence>
						{error && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
							>
								<Alert variant="destructive" className="mb-4">
									<AlertCircle className="h-4 w-4" />
									<AlertTitle>{languages[uiLanguage].error}</AlertTitle>
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							</motion.div>
						)}
					</AnimatePresence>

					<AnimatePresence>
						{outputText && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
							>
								<div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
									<div className="flex justify-between items-center mb-2">
										<h2 className="text-xl font-semibold">
											{languages[uiLanguage].result}
										</h2>
										<div>
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													speakText(
														outputText,
														activeTab === "translation" ? toLang : "ja",
													)
												}
												className="mr-2"
											>
												<Volume2 className="h-4 w-4" />
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={copyToClipboard}
											>
												{copied ? (
													<Check className="h-4 w-4" />
												) : (
													<Copy className="h-4 w-4" />
												)}
											</Button>
										</div>
									</div>
									<p
										className="text-lg font-bold"
										style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
									>
										{outputText}
									</p>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{history.length > 0 && (
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-4 border-blue-500">
						<div className="flex justify-between items-center mb-4">
							<h2
								className="text-2xl font-semibold"
								style={{ fontFamily: "'Bangers', cursive" }}
							>
								{languages[uiLanguage].history}
							</h2>
							<Button variant="outline" size="sm" onClick={clearHistory}>
								<RotateCcw className="h-4 w-4 mr-2" />
								{languages[uiLanguage].clearHistory}
							</Button>
						</div>
						<ul className="space-y-2">
							{history.map((item) => (
								<li
									key={item.id}
									className="bg-gray-100 dark:bg-gray-700 p-2 rounded"
								>
									<p className="font-medium">
										{item.input} ({item.from} to {item.to})
									</p>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										{item.output}
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
										{item.mode === "translation"
											? languages[uiLanguage].tabs.translation
											: languages[uiLanguage].tabs.japaneseConversion}
									</p>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}
