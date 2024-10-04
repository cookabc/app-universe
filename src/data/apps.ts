export type AppData = {
	name: string;
	description: string;
	color: string;
	path: string;
};

const apps: AppData[] = [
	{
		name: "Language Converter",
		description: "Convert text between different languages",
		color: "#F7B731",
		path: "/lang-converter",
	},
	{
		name: "MBTI Test",
		description: "Take the MBTI personality test",
		color: "#FF6B6B",
		path: "/mbti-test",
	},
	{
		name: "Social Media",
		description: "Connect with friends and share updates",
		color: "#4ECDC4",
		path: "/social-media",
	},
	{
		name: "Salary Calculator",
		description: "Calculate your expected salary",
		color: "#45B7D1",
		path: "/salary-calculator",
	},
	{
		name: "Tool Navigation",
		description: "Navigate to your favorite tools",
		color: "#F7B731",
		path: "/tool-navigation",
	},
	{
		name: "Contribution Graph",
		description: "Visualize your contributions over time",
		color: "#F7B731",
		path: "/contribution-graph",
	},
	{
		name: "AI Artifacts",
		description: "Discover AI-generated artifacts",
		color: "#4B7BEC",
		path: "/ai-artifacts",
	},
	{
		name: "Word Search",
		description: "Find words in a grid",
		color: "#4B7BEC",
		path: "/word-search",
	},
];

export default apps;
