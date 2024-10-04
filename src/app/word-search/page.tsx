"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Star, Trophy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const LEVELS = [
	{ theme: "动物", words: ["猫", "狗", "鸟", "鱼"], size: 5 },
	{ theme: "水果", words: ["苹果", "香蕉", "橙子", "葡萄"], size: 6 },
	{ theme: "颜色", words: ["红", "蓝", "绿", "黄", "紫"], size: 6 },
	{ theme: "交通", words: ["车", "船", "飞机", "自行车"], size: 7 },
	{ theme: "家具", words: ["桌", "椅", "床", "柜", "沙发"], size: 7 },
];

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"];

export default function WordSearchGame() {
	const [currentLevel, setCurrentLevel] = useState(0);
	const [matrix, setMatrix] = useState<string[][]>([]);
	const [remainingWords, setRemainingWords] = useState<string[]>([]);
	const [foundWords, setFoundWords] = useState<
		{ word: string; cells: [number, number][]; color: string }[]
	>([]);
	const [score, setScore] = useState(0);
	const [totalScore, setTotalScore] = useState(0);
	const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
	const [isSelecting, setIsSelecting] = useState(false);
	const [gameState, setGameState] = useState<
		"ready" | "playing" | "won" | "completed"
	>("ready");
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (remainingWords.length === 0 && gameState === "playing") {
			if (currentLevel < LEVELS.length - 1) {
				setGameState("won");
			} else {
				setGameState("completed");
			}
		}
	}, [remainingWords, gameState, currentLevel]);

	useEffect(() => {
		drawLines();
	}, []);

	const startLevel = (level: number) => {
		const { words, size } = LEVELS[level];
		setRemainingWords([...words]);
		setFoundWords([]);
		setMatrix(generateMatrix(words, size));
		setScore(0);
		setGameState("playing");
	};

	const generateMatrix = (words: string[], size: number): string[][] => {
		const matrix = Array.from({ length: size }, () =>
			Array.from({ length: size }, () => ""),
		);

		for (const word of words) {
			let placed = false;
			while (!placed) {
				const direction = Math.random() < 0.5 ? "horizontal" : "vertical";
				const row = Math.floor(Math.random() * size);
				const col = Math.floor(Math.random() * size);

				if (canPlaceWord(matrix, word, row, col, direction, size)) {
					placeWord(matrix, word, row, col, direction);
					placed = true;
				}
			}
		}

		const chineseChars =
			"的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严龙飞";
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				if (matrix[i][j] === "") {
					matrix[i][j] =
						chineseChars[Math.floor(Math.random() * chineseChars.length)];
				}
			}
		}

		return matrix;
	};

	const canPlaceWord = (
		matrix: string[][],
		word: string,
		row: number,
		col: number,
		direction: string,
		size: number,
	): boolean => {
		if (direction === "horizontal" && col + word.length > size) return false;
		if (direction === "vertical" && row + word.length > size) return false;

		for (let i = 0; i < word.length; i++) {
			const currentRow = direction === "horizontal" ? row : row + i;
			const currentCol = direction === "horizontal" ? col + i : col;
			if (
				matrix[currentRow][currentCol] !== "" &&
				matrix[currentRow][currentCol] !== word[i]
			) {
				return false;
			}
		}
		return true;
	};

	const placeWord = (
		matrix: string[][],
		word: string,
		row: number,
		col: number,
		direction: string,
	) => {
		for (let i = 0; i < word.length; i++) {
			const currentRow = direction === "horizontal" ? row : row + i;
			const currentCol = direction === "horizontal" ? col + i : col;
			matrix[currentRow][currentCol] = word[i];
		}
	};

	const handleCellMouseDown = (row: number, col: number) => {
		if (gameState !== "playing") return;
		setIsSelecting(true);
		setSelectedCells([[row, col]]);
	};

	const handleCellMouseEnter = (row: number, col: number) => {
		if (isSelecting && gameState === "playing") {
			setSelectedCells((prev) => [...prev, [row, col]]);
		}
	};

	const handleCellMouseUp = () => {
		if (gameState !== "playing") return;
		setIsSelecting(false);
		const selectedWord = selectedCells
			.map(([row, col]) => matrix[row][col])
			.join("");
		if (remainingWords.includes(selectedWord)) {
			setRemainingWords((prev) => prev.filter((word) => word !== selectedWord));
			setFoundWords((prev) => [
				...prev,
				{
					word: selectedWord,
					cells: selectedCells,
					color: COLORS[foundWords.length % COLORS.length],
				},
			]);
			const newScore = score + selectedWord.length * 10;
			setScore(newScore);
			setTotalScore(totalScore + selectedWord.length * 10);
		}
		setSelectedCells([]);
	};

	const isCellSelected = (row: number, col: number) => {
		return selectedCells.some(([r, c]) => r === row && c === col);
	};

	const isCellFound = (row: number, col: number) => {
		return foundWords.some(({ cells }) =>
			cells.some(([r, c]) => r === row && c === col),
		);
	};

	const getCellColor = (row: number, col: number) => {
		const foundWord = foundWords.find(({ cells }) =>
			cells.some(([r, c]) => r === row && c === col),
		);
		return foundWord ? foundWord.color : "";
	};

	const drawLines = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const cellSize = 48; // This should match the size of your grid cells
		const cellSpacing = 4; // This should match the gap between your grid cells

		// Draw lines for selected cells
		if (selectedCells.length > 1) {
			ctx.beginPath();
			ctx.strokeStyle = "rgba(255, 255, 0, 0.5)";
			ctx.lineWidth = 4;
			selectedCells.forEach(([row, col], index) => {
				const x = col * (cellSize + cellSpacing) + cellSize / 2;
				const y = row * (cellSize + cellSpacing) + cellSize / 2;
				if (index === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			});
			ctx.stroke();
		}
		// Draw lines for found words
		for (const { cells, color } of foundWords) {
			ctx.beginPath();
			ctx.strokeStyle = color;
			ctx.lineWidth = 4;
			for (let index = 0; index < cells.length; index++) {
				const [row, col] = cells[index];
				const x = col * (cellSize + cellSpacing) + cellSize / 2;
				const y = row * (cellSize + cellSpacing) + cellSize / 2;
				if (index === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			}
			ctx.stroke();
		}
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-r from-blue-500 to-purple-600">
			<Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-purple-500 to-pink-500 text-white">
				<CardHeader className="text-center">
					<CardTitle className="text-3xl font-bold">文字搜索挑战</CardTitle>
					<p className="text-xl">主题：{LEVELS[currentLevel].theme}</p>
					<p className="text-lg">
						关卡：{currentLevel + 1} / {LEVELS.length}
					</p>
				</CardHeader>
				<CardContent>
					<div className="grid gap-6">
						<div className="flex justify-between items-center">
							<div className="flex items-center gap-2">
								<Star className="text-yellow-300" />
								<span className="text-2xl font-bold">本关得分：{score}</span>
							</div>
							<div className="flex items-center gap-2">
								<Trophy className="text-yellow-300" />
								<span className="text-2xl font-bold">总得分：{totalScore}</span>
							</div>
						</div>
						<AnimatePresence mode="wait">
							<motion.div
								key={currentLevel}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								transition={{ duration: 0.5 }}
								className="relative"
							>
								<canvas
									ref={canvasRef}
									width={LEVELS[currentLevel].size * 52}
									height={LEVELS[currentLevel].size * 52}
									className="absolute top-0 left-0 pointer-events-none"
								/>
								<div
									className="grid gap-1"
									style={{
										gridTemplateColumns: `repeat(${LEVELS[currentLevel].size}, minmax(0, 1fr))`,
									}}
								>
									{matrix.map((row, rowIndex) =>
										row.map((cell, colIndex) => (
											<motion.div
												key={`${rowIndex}-${cell}`}
												className={`w-12 h-12 flex items-center justify-center border-2 rounded-md font-bold text-2xl cursor-pointer transition-all duration-300
                        ${
													isCellSelected(rowIndex, colIndex)
														? "bg-yellow-300 text-purple-800"
														: isCellFound(rowIndex, colIndex)
															? "bg-white text-purple-900 shadow-lg scale-105"
															: "bg-white/20"
												}`}
												whileHover={{ scale: 1.1 }}
												whileTap={{ scale: 0.9 }}
												onMouseDown={() =>
													handleCellMouseDown(rowIndex, colIndex)
												}
												onMouseEnter={() =>
													handleCellMouseEnter(rowIndex, colIndex)
												}
												onMouseUp={handleCellMouseUp}
												style={{
													color: isCellFound(rowIndex, colIndex)
														? getCellColor(rowIndex, colIndex)
														: undefined,
													textShadow: isCellFound(rowIndex, colIndex)
														? "0 0 10px rgba(255,255,255,0.5)"
														: "none",
												}}
											>
												{cell}
											</motion.div>
										)),
									)}
								</div>
							</motion.div>
						</AnimatePresence>
						<div>
							<h3 className="text-xl font-semibold mb-2">剩余单词：</h3>
							<div className="flex flex-wrap gap-2">
								{remainingWords.map((word) => (
									<motion.span
										key={word}
										className="px-3 py-1 bg-white/30 rounded-full text-lg"
										whileHover={{ scale: 1.05 }}
									>
										{word}
									</motion.span>
								))}
							</div>
						</div>
						{gameState === "ready" && (
							<Button
								onClick={() => startLevel(currentLevel)}
								size="lg"
								className="bg-green-500 hover:bg-green-600"
							>
								开始游戏
							</Button>
						)}
						{gameState === "playing" && (
							<Button
								onClick={() => startLevel(currentLevel)}
								size="lg"
								className="bg-yellow-500 hover:bg-yellow-600"
							>
								重新开始本关
							</Button>
						)}
						{gameState === "won" && (
							<div className="text-center">
								<h2 className="text-3xl font-bold mb-4">
									<span className="flex items-center justify-center gap-2">
										<Trophy className="text-yellow-300" />
										恭喜你通过本关！
									</span>
								</h2>
								<p className="text-xl mb-4">你的得分：{score}</p>
								<Button
									onClick={() => {
										setCurrentLevel((prev) => prev + 1);
										startLevel(currentLevel + 1);
									}}
									size="lg"
									className="bg-green-500 hover:bg-green-600"
								>
									<ArrowRight className="mr-2 h-4 w-4" /> 进入下一关
								</Button>
							</div>
						)}
						{gameState === "completed" && (
							<div className="text-center">
								<h2 className="text-3xl font-bold mb-4">
									<span className="flex items-center justify-center gap-2">
										<Trophy className="text-yellow-300" />
										恭喜你完成所有关卡！
									</span>
								</h2>
								<p className="text-xl mb-4">你的总得分：{totalScore}</p>
								<Button
									onClick={() => {
										setCurrentLevel(0);
										setTotalScore(0);
										startLevel(0);
									}}
									size="lg"
									className="bg-green-500 hover:bg-green-600"
								>
									重新开始游戏
								</Button>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</main>
	);
}
