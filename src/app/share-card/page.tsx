"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";
import html2canvas from "html2canvas";
import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	Download,
	Linkedin,
	Moon,
	Redo,
	Sun,
	Twitter,
	Undo,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
	tomorrow,
	twilight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fontOptions = [
	{ value: "font-sans", label: "Sans-serif" },
	{ value: "font-serif", label: "Serif" },
	{ value: "font-mono", label: "Monospace" },
	{ value: "font-pacifico", label: "Pacifico" },
	{ value: "font-bangers", label: "Bangers" },
	{ value: "font-lobster", label: "Lobster" },
];

const borderStyles = [
	{ value: "border-solid", label: "Solid" },
	{ value: "border-dashed", label: "Dashed" },
	{ value: "border-dotted", label: "Dotted" },
	{ value: "border-double", label: "Double" },
];

const alignmentOptions = [
	{ value: "text-left", label: "Left", icon: AlignLeft },
	{ value: "text-center", label: "Center", icon: AlignCenter },
	{ value: "text-right", label: "Right", icon: AlignRight },
];

const themeOptions = [
	{
		value: "bg-gradient-to-r from-blue-500 to-purple-600",
		label: "Blue to Purple",
	},
	{
		value: "bg-gradient-to-r from-green-400 to-blue-500",
		label: "Green to Blue",
	},
	{ value: "bg-gradient-to-r from-yellow-400 to-red-500", label: "Sunset" },
	{
		value: "bg-gradient-to-r from-pink-500 to-purple-500",
		label: "Pink to Purple",
	},
	{
		value: "bg-gradient-to-r from-indigo-500 to-purple-600",
		label: "Indigo to Purple",
	},
	{
		value: "bg-gradient-to-r from-gray-700 to-gray-900",
		label: "Dark Gradient",
	},
	{ value: "bg-gradient-to-r from-red-900 to-black", label: "Dracula" },
];

const textureOptions = [
	{ value: "bg-[url(/textures/noise.png)] bg-repeat", label: "Noise" },
	{ value: "bg-[url(/textures/dots.png)] bg-repeat", label: "Dots" },
	{ value: "bg-[url(/textures/lines.png)] bg-repeat", label: "Lines" },
	{ value: "bg-[url(/textures/waves.png)] bg-repeat", label: "Waves" },
	{ value: "bg-[url(/textures/blood.png)] bg-repeat", label: "Blood Splatter" },
];

export default function EnhancedShareCardGenerator() {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [signature, setSignature] = useState("");
	const [language, setLanguage] = useState("javascript");
	const [theme, setTheme] = useState(
		"bg-gradient-to-r from-blue-500 to-purple-600",
	);
	const [texture, setTexture] = useState("");
	const [mode, setMode] = useState("text");
	const [fontSize, setFontSize] = useState(16);
	const [darkMode, setDarkMode] = useState(false);
	const [showLogo, setShowLogo] = useState(false);
	const [font, setFont] = useState("font-sans");
	const [borderStyle, setBorderStyle] = useState("border-solid");
	const [borderWidth, setBorderWidth] = useState(2);
	const [logo, setLogo] = useState<string | null>(null);
	const [textAlignment, setTextAlignment] = useState("text-left");
	const [padding, setPadding] = useState(16);
	const [history, setHistory] = useState<
		Array<{
			title: string;
			content: string;
			signature: string;
			theme: string;
			texture: string;
			fontSize: number;
			font: string;
			borderStyle: string;
			borderWidth: number;
			textAlignment: string;
			padding: number;
		}>
	>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const cardRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const savedState = localStorage.getItem("cardState");
		if (savedState) {
			try {
				const parsedState = JSON.parse(savedState);
				setTitle(parsedState.title || "");
				setContent(parsedState.content || "");
				setSignature(parsedState.signature || "");
				setTheme(
					parsedState.theme || "bg-gradient-to-r from-blue-500 to-purple-600",
				);
				setTexture(parsedState.texture || "");
				setFontSize(parsedState.fontSize || 16);
				setFont(parsedState.font || "font-sans");
				setBorderStyle(parsedState.borderStyle || "border-solid");
				setBorderWidth(parsedState.borderWidth || 2);
				setTextAlignment(parsedState.textAlignment || "text-left");
				setPadding(parsedState.padding || 16);
				setLogo(parsedState.logo || null);

				// Initialize history with the loaded state
				setHistory([
					{
						title: parsedState.title || "",
						content: parsedState.content || "",
						signature: parsedState.signature || "",
						theme:
							parsedState.theme ||
							"bg-gradient-to-r from-blue-500 to-purple-600",
						texture: parsedState.texture || "",
						fontSize: parsedState.fontSize || 16,
						font: parsedState.font || "font-sans",
						borderStyle: parsedState.borderStyle || "border-solid",
						borderWidth: parsedState.borderWidth || 2,
						textAlignment: parsedState.textAlignment || "text-left",
						padding: parsedState.padding || 16,
					},
				]);
				setHistoryIndex(0);
			} catch (error) {
				console.error("Error parsing saved state:", error);
			}
		}
	}, []);

	useEffect(() => {
		const state = {
			title,
			content,
			signature,
			theme,
			texture,
			fontSize,
			font,
			borderStyle,
			borderWidth,
			textAlignment,
			padding,
			logo,
		};
		localStorage.setItem("cardState", JSON.stringify(state));
	}, [
		title,
		content,
		signature,
		theme,
		texture,
		fontSize,
		font,
		borderStyle,
		borderWidth,
		textAlignment,
		padding,
		logo,
	]);

	const updateHistory = useCallback(
		(newState: {
			title: string;
			content: string;
			signature: string;
			theme: string;
			texture: string;
			fontSize: number;
			font: string;
			borderStyle: string;
			borderWidth: number;
			textAlignment: string;
			padding: number;
		}) => {
			setHistory((prev) => {
				const newHistory = prev.slice(0, historyIndex + 1);
				return [...newHistory, newState];
			});
			setHistoryIndex((prev) => prev + 1);
		},
		[historyIndex],
	);

	const undo = useCallback(() => {
		if (historyIndex > 0) {
			setHistoryIndex((prev) => prev - 1);
			const prevState = history[historyIndex - 1];
			if (prevState) {
				setTitle(prevState.title);
				setContent(prevState.content);
				setSignature(prevState.signature);
				setTheme(prevState.theme);
				setTexture(prevState.texture);
				setFontSize(prevState.fontSize);
				setFont(prevState.font);
				setBorderStyle(prevState.borderStyle);
				setBorderWidth(prevState.borderWidth);
				setTextAlignment(prevState.textAlignment);
				setPadding(prevState.padding);
			}
		}
	}, [historyIndex, history]);

	const redo = useCallback(() => {
		if (historyIndex < history.length - 1) {
			setHistoryIndex((prev) => prev + 1);
			const nextState = history[historyIndex + 1];
			if (nextState) {
				setTitle(nextState.title);
				setContent(nextState.content);
				setSignature(nextState.signature);
				setTheme(nextState.theme);
				setTexture(nextState.texture);
				setFontSize(nextState.fontSize);
				setFont(nextState.font);
				setBorderStyle(nextState.borderStyle);
				setBorderWidth(nextState.borderWidth);
				setTextAlignment(nextState.textAlignment);
				setPadding(nextState.padding);
			}
		}
	}, [historyIndex, history]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey || e.metaKey) {
				if (e.key === "z") {
					e.preventDefault();
					undo();
				} else if (e.key === "y") {
					e.preventDefault();
					redo();
				}
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [undo, redo]);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		const file = acceptedFiles[0];
		const reader = new FileReader();
		reader.onload = (event: ProgressEvent<FileReader>) => {
			if (event.target && typeof event.target.result === "string") {
				setLogo(event.target.result);
			}
		};
		reader.readAsDataURL(file);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: { "image/*": [] },
	});

	const handleDownload = async () => {
		if (cardRef.current) {
			const canvas = await html2canvas(cardRef.current);
			const image = canvas.toDataURL("image/png");
			const link = document.createElement("a");
			link.href = image;
			link.download = "share-card.png";
			link.click();
			toast.success("Card downloaded successfully!");
		}
	};

	const handleShare = async (platform: string) => {
		if (cardRef.current) {
			const canvas = await html2canvas(cardRef.current);
			const image = canvas.toDataURL("image/png");
			let shareUrl = "";

			switch (platform) {
				case "Twitter":
					shareUrl = `https://twitter.com/intent/tweet?text=Check%20out%20my%20share%20card!&url=${encodeURIComponent(image)}`;
					break;
				case "LinkedIn":
					shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(image)}`;
					break;
				default:
					toast.error("Unsupported platform");
					return;
			}

			window.open(shareUrl, "_blank");
			toast.success(`Shared to ${platform}!`);
		}
	};

	const handleTitleChange = (newTitle: string) => {
		setTitle(newTitle);
		updateHistory({
			title: newTitle,
			content,
			signature,
			theme,
			texture,
			fontSize,
			font,
			borderStyle,
			borderWidth,
			textAlignment,
			padding,
		});
	};

	const handleContentChange = (newContent: string) => {
		setContent(newContent);
		updateHistory({
			title,
			content: newContent,
			signature,
			theme,
			texture,
			fontSize,
			font,
			borderStyle,
			borderWidth,
			textAlignment,
			padding,
		});
	};

	const handleSignatureChange = (newSignature: string) => {
		setSignature(newSignature);
		updateHistory({
			title,
			content,
			signature: newSignature,
			theme,
			texture,
			fontSize,
			font,
			borderStyle,
			borderWidth,
			textAlignment,
			padding,
		});
	};

	const handleThemeChange = (newTheme: string) => {
		setTheme(newTheme);
		updateHistory({
			title,
			content,
			signature,
			theme: newTheme,
			texture,
			fontSize,
			font,
			borderStyle,
			borderWidth,
			textAlignment,
			padding,
		});
	};

	const handleTextureChange = (newTexture: string) => {
		setTexture(newTexture);
		updateHistory({
			title,
			content,
			signature,
			theme,
			texture: newTexture,
			fontSize,
			font,
			borderStyle,
			borderWidth,
			textAlignment,
			padding,
		});
	};

	const handleFontSizeChange = (newFontSize: number) => {
		setFontSize(newFontSize);

		updateHistory({
			title,
			content,
			signature,
			theme,
			texture,
			fontSize: newFontSize,
			font,
			borderStyle,
			borderWidth,
			textAlignment,
			padding,
		});
	};

	const handleFontChange = (newFont: string) => {
		setFont(newFont);
		updateHistory({
			title,
			content,
			signature,
			theme,
			texture,
			fontSize,
			font: newFont,
			borderStyle,
			borderWidth,
			textAlignment,
			padding,
		});
	};

	const handleBorderStyleChange = (newBorderStyle: string) => {
		setBorderStyle(newBorderStyle);
		updateHistory({
			title,
			content,
			signature,
			theme,
			texture,
			fontSize,
			font,
			borderStyle: newBorderStyle,
			borderWidth,
			textAlignment,
			padding,
		});
	};

	const handleBorderWidthChange = (newBorderWidth: number) => {
		setBorderWidth(newBorderWidth);
		updateHistory({
			title,
			content,
			signature,
			theme,
			texture,
			fontSize,
			font,
			borderStyle,
			borderWidth: newBorderWidth,
			textAlignment,
			padding,
		});
	};

	const handleTextAlignmentChange = (newAlignment: string) => {
		setTextAlignment(newAlignment);
		updateHistory({
			title,
			content,
			signature,
			theme,
			texture,
			fontSize,
			font,
			borderStyle,
			borderWidth,
			textAlignment: newAlignment,
			padding,
		});
	};

	const handlePaddingChange = (newPadding: number) => {
		setPadding(newPadding);
		updateHistory({
			title,
			content,
			signature,
			theme,
			texture,
			fontSize,
			font,
			borderStyle,
			borderWidth,
			textAlignment,
			padding: newPadding,
		});
	};

	return (
		<div
			className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100"}`}
		>
			<div className="container mx-auto p-4">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Enhanced Share Card Generator</h1>
					<div className="flex items-center space-x-4">
						<Button
							onClick={undo}
							disabled={historyIndex <= 0}
							aria-label="Undo"
						>
							<Undo className="h-5 w-5" />
						</Button>
						<Button
							onClick={redo}
							disabled={historyIndex >= history.length - 1}
							aria-label="Redo"
						>
							<Redo className="h-5 w-5" />
						</Button>
						<Switch
							checked={darkMode}
							onCheckedChange={setDarkMode}
							className="ml-4"
						/>
						{darkMode ? (
							<Moon className="h-5 w-5" />
						) : (
							<Sun className="h-5 w-5" />
						)}
					</div>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<Card className={darkMode ? "bg-gray-800" : ""}>
						<CardContent className="p-6">
							<div className="mb-4">
								<Label htmlFor="title">Title</Label>
								<Input
									id="title"
									value={title}
									onChange={(e) => handleTitleChange(e.target.value)}
									placeholder="Enter card title"
									className={darkMode ? "bg-gray-700 text-white" : ""}
								/>
							</div>
							<Tabs
								defaultValue="text"
								onValueChange={(value: string) => setMode(value)}
							>
								<TabsList className="grid w-full grid-cols-2 mb-4">
									<TabsTrigger value="text">Text</TabsTrigger>
									<TabsTrigger value="code">Code</TabsTrigger>
								</TabsList>
								<TabsContent value="text">
									<Textarea
										placeholder="Enter your text here"
										value={content}
										onChange={(e) => handleContentChange(e.target.value)}
										className={`w-full h-40 ${darkMode ? "bg-gray-700 text-white" : ""}`}
									/>
								</TabsContent>
								<TabsContent value="code">
									<SyntaxHighlighter
										language={language}
										style={darkMode ? twilight : tomorrow}
										customStyle={{ height: "200px" }}
									>
										{content}
									</SyntaxHighlighter>
									<Select value={language} onValueChange={setLanguage}>
										<SelectTrigger
											className={`w-full mt-2 ${darkMode ? "bg-gray-700 text-white" : ""}`}
										>
											<SelectValue placeholder="Select language" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="javascript">JavaScript</SelectItem>
											<SelectItem value="python">Python</SelectItem>
											<SelectItem value="cpp">C++</SelectItem>
											<SelectItem value="java">Java</SelectItem>
											<SelectItem value="rust">Rust</SelectItem>
											<SelectItem value="typescript">TypeScript</SelectItem>
											<SelectItem value="html">HTML</SelectItem>
											<SelectItem value="css">CSS</SelectItem>
										</SelectContent>
									</Select>
								</TabsContent>
							</Tabs>
							<div className="mt-4">
								<Label htmlFor="signature">Signature</Label>
								<Input
									id="signature"
									value={signature}
									onChange={(e) => handleSignatureChange(e.target.value)}
									placeholder="Enter your signature"
									className={darkMode ? "bg-gray-700 text-white" : ""}
								/>
							</div>
							<div className="mt-4 space-y-4">
								<div>
									<Label htmlFor="theme">Theme</Label>
									<Select value={theme} onValueChange={handleThemeChange}>
										<SelectTrigger
											className={`w-full ${darkMode ? "bg-gray-700 text-white" : ""}`}
										>
											<SelectValue placeholder="Select theme" />
										</SelectTrigger>
										<SelectContent>
											{themeOptions.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor="texture">Background Texture</Label>
									<Select value={texture} onValueChange={handleTextureChange}>
										<SelectTrigger
											className={`w-full ${darkMode ? "bg-gray-700 text-white" : ""}`}
										>
											<SelectValue placeholder="Select texture" />
										</SelectTrigger>
										<SelectContent>
											{textureOptions.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor="fontSize">Font Size: {fontSize}px</Label>
									<Slider
										id="fontSize"
										min={12}
										max={24}
										step={1}
										value={[fontSize]}
										onValueChange={(value) => handleFontSizeChange(value[0])}
										className="w-full"
									/>
								</div>
								<div>
									<Label htmlFor="font">Font</Label>
									<Select value={font} onValueChange={handleFontChange}>
										<SelectTrigger
											className={`w-full ${darkMode ? "bg-gray-700 text-white" : ""}`}
										>
											<SelectValue placeholder="Select font" />
										</SelectTrigger>
										<SelectContent>
											{fontOptions.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor="borderStyle">Border Style</Label>
									<Select
										value={borderStyle}
										onValueChange={handleBorderStyleChange}
									>
										<SelectTrigger
											className={`w-full ${darkMode ? "bg-gray-700 text-white" : ""}`}
										>
											<SelectValue placeholder="Select border style" />
										</SelectTrigger>
										<SelectContent>
											{borderStyles.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor="borderWidth">
										Border Width: {borderWidth}px
									</Label>
									<Slider
										id="borderWidth"
										min={0}
										max={10}
										step={1}
										value={[borderWidth]}
										onValueChange={(value) => handleBorderWidthChange(value[0])}
										className="w-full"
									/>
								</div>
								<div>
									<Label htmlFor="textAlignment">Text Alignment</Label>
									<div className="flex space-x-2 mt-2">
										{alignmentOptions.map((option) => (
											<Button
												key={option.value}
												onClick={() => handleTextAlignmentChange(option.value)}
												variant={
													textAlignment === option.value ? "default" : "outline"
												}
												className="flex-1"
											>
												<option.icon className="h-5 w-5" />
											</Button>
										))}
									</div>
								</div>
								<div>
									<Label htmlFor="padding">Padding: {padding}px</Label>
									<Slider
										id="padding"
										min={0}
										max={48}
										step={4}
										value={[padding]}
										onValueChange={(value) => handlePaddingChange(value[0])}
										className="w-full"
									/>
								</div>
								<div className="flex items-center space-x-2">
									<Switch
										id="show-logo"
										checked={showLogo}
										onCheckedChange={setShowLogo}
									/>
									<Label htmlFor="show-logo">Show Logo</Label>
								</div>
								{showLogo && (
									<div
										{...getRootProps()}
										className={`border-2 border-dashed rounded-md p-4 ${isDragActive ? "border-blue-500" : "border-gray-300"}`}
									>
										<input {...getInputProps()} />
										{logo ? (
											<div className="flex items-center justify-center">
												<img
													src={logo}
													alt="Uploaded logo"
													className="max-h-20"
												/>
											</div>
										) : (
											<p>
												Drag 'n' drop a logo here, or click to select a file
											</p>
										)}
									</div>
								)}
							</div>
						</CardContent>
					</Card>
					<Card className={darkMode ? "bg-gray-800" : ""}>
						<CardContent className="p-6">
							<h2 className="text-xl font-semibold mb-4">Preview</h2>
							<AnimatePresence>
								<motion.div
									key={`${theme}-${texture}-${borderStyle}-${textAlignment}`}
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.9 }}
									transition={{ duration: 0.3 }}
								>
									<div
										ref={cardRef}
										className={`${theme} ${texture} rounded-lg relative overflow-hidden transition-all duration-300 ease-in-out ${borderStyle} ${font} ${textAlignment} ${theme.includes("from-red-900") ? "text-red-200" : "text-white"}`}
										style={{
											minHeight: "200px",
											borderWidth: `${borderWidth}px`,
											borderColor: theme.includes("from-red-900")
												? "#ff6e6e"
												: "white",
											padding: `${padding}px`,
										}}
									>
										{showLogo && logo && (
											<div className="absolute top-2 right-2">
												<img src={logo} alt="Logo" className="h-8 w-8" />
											</div>
										)}
										{title && (
											<h3 className="text-xl font-bold mb-2">{title}</h3>
										)}
										{mode === "text" ? (
											<p
												className="whitespace-pre-wrap"
												style={{ fontSize: `${fontSize}px` }}
											>
												{content}
											</p>
										) : (
											<SyntaxHighlighter
												language={language}
												style={darkMode ? twilight : tomorrow}
												customStyle={{ fontSize: `${fontSize}px` }}
											>
												{content}
											</SyntaxHighlighter>
										)}
										{signature && (
											<p className="mt-4 text-right italic">{signature}</p>
										)}
									</div>
								</motion.div>
							</AnimatePresence>
							<div className="mt-4 space-y-2">
								<div className="flex space-x-2">
									<Button onClick={handleDownload} className="flex-1">
										<Download className="mr-2 h-4 w-4" /> Download Card
									</Button>
									<Button
										onClick={() => handleShare("Twitter")}
										className="flex-1"
									>
										<Twitter className="mr-2 h-4 w-4" /> Share on Twitter
									</Button>
									<Button
										onClick={() => handleShare("LinkedIn")}
										className="flex-1"
									>
										<Linkedin className="mr-2 h-4 w-4" /> Share on LinkedIn
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
			<ToastContainer position="bottom-right" />
		</div>
	);
}
