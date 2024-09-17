export interface Skill {
	id: number;
	name: string;
	level: number;
}

export interface Achievement {
	id: number;
	name: string;
	unlocked: boolean;
}

export interface PlayerData {
	name: string;
	level: number;
	exp: number;
	avatar?: string;
	unlockedLevels?: number[];
	completedLevels?: number[];
	completedChallenges?: string[];
	skills?: Skill[];
	achievements?: Achievement[];
}

export interface LeaderboardData {
	rank: number;
	name: string;
	score: number;
	avatar?: string;
}

export interface Challenge {
	id: number;
	type: "text-completion" | "multiple-choice" | "prompt-improvement";
	title: string;
	description: string;
	initialPrompt: string;
	options?: string[];
	correctAnswer?: string;
	targetOutput?: string;
}
