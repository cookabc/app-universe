"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ContributionGraph.module.css";

const MAX_INPUT_LENGTH = 10;
const CANVAS_WIDTH = 60;
const CANVAS_HEIGHT = 12;
const FONT_SIZE = 9;
const GRID_ROWS = 7;
const GRID_COLUMNS = 53;
const ALPHA_THRESHOLD = 100;

const colorLevels = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
const weekdays = [
	{ label: "", key: "Sun" },
	{ label: "Mon", key: "Mon" },
	{ label: "", key: "Tue" },
	{ label: "Wed", key: "Wed" },
	{ label: "", key: "Thu" },
	{ label: "Fri", key: "Fri" },
	{ label: "", key: "Sat" },
];
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

export default function ContributionGraph() {
	const [inputText, setInputText] = useState<string>("BE SMART");
	const [gridData, setGridData] = useState<number[][]>([]);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const text = e.target.value.slice(0, MAX_INPUT_LENGTH);
		setInputText(text);
	}, []);

	const generateGridData = useCallback((imageData: ImageData) => {
		const data = imageData.data;
		const grid: number[][] = [];

		for (let y = 0; y < GRID_ROWS; y++) {
			const row: number[] = [];
			for (let x = 0; x < imageData.width; x++) {
				const index = (y * imageData.width + x) * 4;
				const alpha = data[index + 3];
				row.push(
					alpha > ALPHA_THRESHOLD ? Math.floor(Math.random() * 4) + 1 : 0,
				);
			}
			grid.push(row);
		}

		return grid;
	}, []);

	useEffect(() => {
		if (!inputText) {
			setGridData([]);
			return;
		}

		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) return;

		canvas.width = CANVAS_WIDTH;
		canvas.height = CANVAS_HEIGHT;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.font = `${FONT_SIZE}px Arial`;
		ctx.textBaseline = "top";
		ctx.fillStyle = "#000000";
		ctx.fillText(inputText, 0, 0);

		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const grid = generateGridData(imageData);

		setGridData(grid);
	}, [inputText, generateGridData]);

	return (
		<div className={styles.container}>
			<h1>GitHub Contribution Graph Generator</h1>
			<input
				type="text"
				placeholder={`Enter up to ${MAX_INPUT_LENGTH} characters`}
				value={inputText}
				onChange={handleChange}
				className={styles.input}
			/>
			<canvas ref={canvasRef} style={{ display: "none" }} />
			<div className={styles.graphContainer}>
				<div className={styles.graph}>
					<WeekdayLabels />
					<div className={styles.gridAndMonths}>
						<ContributionGrid gridData={gridData} />
						<MonthLabels />
					</div>
				</div>
				<Legend />
			</div>
		</div>
	);
}

const WeekdayLabels = () => (
	<div className={styles.weekdays}>
		{weekdays.map((day) => (
			<div key={day.key} className={styles.weekday}>
				{day.label}
			</div>
		))}
	</div>
);

const ContributionGrid = ({ gridData }: { gridData: number[][] }) => (
	<div className={styles.grid}>
		{Array.from({ length: GRID_COLUMNS }).map((_, weekIndex) => (
			<div key={`week-${weekIndex}`} className={styles.gridColumn}>
				{Array.from({ length: GRID_ROWS }).map((_, dayIndex) => {
					const cellValue = gridData[dayIndex]?.[weekIndex] || 0;
					return (
						<div
							key={`cell-${weekIndex}-${dayIndex}`}
							className={styles.gridCell}
							style={{
								backgroundColor: colorLevels[Math.min(cellValue, 4)],
							}}
						/>
					);
				})}
			</div>
		))}
	</div>
);

const MonthLabels = () => (
	<div className={styles.months}>
		{months.map((month) => (
			<div key={`month-${month}`} className={styles.month}>
				{month}
			</div>
		))}
	</div>
);

const Legend = () => (
	<div className={styles.legend}>
		<span>Less</span>
		{colorLevels.map((color) => (
			<div
				key={`legend-${color}`}
				className={styles.legendCell}
				style={{ backgroundColor: color }}
			/>
		))}
		<span>More</span>
	</div>
);
