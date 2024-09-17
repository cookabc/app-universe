"use server";

// 模拟玩家数据
let playerData = {
	name: "Player",
	level: 1,
	exp: 0,
	avatar: "/logo.jpeg?height=64&width=64",
	unlockedLevels: [1],
	completedLevels: [],
	skills: [
		{ id: 1, name: "基础总结", level: 1 },
		{ id: 2, name: "高级推理", level: 0 },
		{ id: 3, name: "多语言支持", level: 0 },
	],
	achievements: [
		{ id: 1, name: "新手提示工程师", unlocked: true },
		{ id: 2, name: "总结大师", unlocked: false },
		{ id: 3, name: "推理专家", unlocked: false },
	],
};

export type PlayerData = typeof playerData;

export interface LeaderboardData {
	rank: number;
	name: string;
	score: number;
	avatar: string;
}

// 模拟排行榜数据
const leaderboardData: LeaderboardData[] = [
	{
		rank: 1,
		name: "Alice",
		score: 1500,
		avatar: "/logo.jpeg?height=32&width=32",
	},
	{
		rank: 2,
		name: "Bob",
		score: 1400,
		avatar: "/logo.jpeg?height=32&width=32",
	},
	{
		rank: 3,
		name: "Charlie",
		score: 1300,
		avatar: "/logo.jpeg?height=32&width=32",
	},
	{
		rank: 4,
		name: "David",
		score: 1200,
		avatar: "/logo.jpeg?height=32&width=32",
	},
	{
		rank: 5,
		name: "Eve",
		score: 1100,
		avatar: "/logo.jpeg?height=32&width=32",
	},
];

export const api = {
	getPlayerData: () => {
		return new Promise<PlayerData>((resolve) => {
			setTimeout(() => resolve(playerData), 300);
		});
	},

	updatePlayerData: (newData: Partial<typeof playerData>) => {
		return new Promise((resolve) => {
			playerData = { ...playerData, ...newData };
			setTimeout(() => resolve(playerData), 300);
		});
	},

	getLeaderboard: () => {
		return new Promise<LeaderboardData[]>((resolve) => {
			setTimeout(() => resolve(leaderboardData), 300);
		});
	},

	submitScore: (score: number) => {
		return new Promise((resolve) => {
			playerData.exp += score;
			if (playerData.exp >= 1000) {
				playerData.level += 1;
				playerData.exp -= 1000;
			}
			// 更新排行榜
			const playerIndex = leaderboardData.findIndex(
				(p) => p.name === playerData.name,
			);
			if (playerIndex === -1) {
				leaderboardData.push({
					rank: 0,
					name: playerData.name,
					score: score,
					avatar: playerData.avatar,
				});
			} else {
				leaderboardData[playerIndex].score += score;
			}
			leaderboardData.sort((a, b) => b.score - a.score);
			leaderboardData.forEach((player, index) => {
				player.rank = index + 1;
			});
			setTimeout(() => resolve(playerData), 300);
		});
	},
};
