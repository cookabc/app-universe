"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ContributionGraph.module.css";

export default function ContributionGraph() {
	const [inputText, setInputText] = useState<string>("BE SAVVY");
	const [gridData, setGridData] = useState<number[][]>([]);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const text = e.target.value.slice(0, 10);
		setInputText(text);
	};

	useEffect(() => {
		if (!inputText) {
			setGridData([]);
			return;
		}

		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const fontSize = 9;
		ctx.font = `${fontSize}px Arial`;
		ctx.textBaseline = "top";

		canvas.width = 60;
		canvas.height = 12;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.font = `${fontSize}px Arial`;
		ctx.textBaseline = "top";
		ctx.fillStyle = "#000000";
		ctx.fillText(inputText, 0, 0);

		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const data = imageData.data;

		const grid: number[][] = [];
		const threshold = 100;
		for (let y = 0; y < 7; y++) {
			const row: number[] = [];
			for (let x = 0; x < imageData.width; x++) {
				const index = (y * imageData.width + x) * 4;
				const alpha = data[index + 3];
				row.push(alpha > threshold ? Math.floor(Math.random() * 3) + 3 : 0);
			}
			grid.push(row);
		}

		setGridData(grid);
	}, [inputText]);

	const colorLevels = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
	const weekdays = ["", "Mon", "", "Wed", "", "Fri", ""];
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	return (
		<div className={styles.container}>
			<h1>GitHub Contribution Graph Generator</h1>
			<input
				type="text"
				placeholder="Enter up to 10 characters"
				value={inputText}
				onChange={handleChange}
				className={styles.input}
			/>
			<canvas ref={canvasRef} style={{ display: "none" }} />
			{gridData.length > 0 && (
				<div className={styles.graphContainer}>
					<div className={styles.graph}>
						<div className={styles.weekdays}>
							{weekdays.map((day, index) => (
								<div key={`weekday-${index}`} className={styles.weekday}>
									{day}
								</div>
							))}
						</div>
						<div className={styles.gridAndMonths}>
							<div className={styles.grid}>
								{Array.from({ length: 53 }).map((_, weekIndex) => (
									<div key={`week-${weekIndex}`} className={styles.gridColumn}>
										{Array.from({ length: 7 }).map((_, dayIndex) => {
											const cellValue = gridData[dayIndex]?.[weekIndex] || 0;
											return (
												<div
													key={`cell-${weekIndex}-${dayIndex}`}
													className={styles.gridCell}
													style={{
														backgroundColor:
															colorLevels[Math.min(cellValue, 4)],
													}}
												/>
											);
										})}
									</div>
								))}
							</div>
							<div className={styles.months}>
								{months.map((month, index) => (
									<div key={`month-${index}`} className={styles.month}>
										{month}
									</div>
								))}
							</div>
						</div>
					</div>
					<div className={styles.legend}>
						<span>Less</span>
						{colorLevels.map((color, index) => (
							<div
								key={`legend-${index}`}
								className={styles.legendCell}
								style={{ backgroundColor: color }}
							/>
						))}
						<span>More</span>
					</div>
				</div>
			)}
		</div>
	);
}
