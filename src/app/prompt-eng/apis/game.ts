import type { Achievement, LeaderboardData, PlayerData } from '../interfaces'

// 模拟玩家数据
let playerData: PlayerData = {
    name: 'Player',
    level: 1,
    exp: 0,
    avatar: '/logo.jpeg?height=64&width=64',
    unlockedLevels: [1],
    completedLevels: [],
    skills: [
        { id: 1, name: '基础总结', level: 1 },
        { id: 2, name: '高级推理', level: 0 },
        { id: 3, name: '多语言支持', level: 0 },
    ],
    achievements: [
        { id: 1, name: '新手提示工程师', unlocked: true },
        { id: 2, name: '总结大师', unlocked: false },
        { id: 3, name: '推理专家', unlocked: false },
    ],
}

const defaultAchievements: Achievement[] = [
    { id: 1, name: '新手提示工程师', unlocked: true },
    { id: 2, name: '总结大师', unlocked: false },
    { id: 3, name: '推理专家', unlocked: false },
]

// 模拟排行榜数据
const leaderboardData: LeaderboardData[] = [
    {
        rank: 1,
        name: 'Alice',
        score: 1500,
        avatar: '/logo.jpeg?height=32&width=32',
        level: 4,
    },
    {
        rank: 2,
        name: 'Bob',
        score: 1400,
        avatar: '/logo.jpeg?height=32&width=32',
        level: 4,
    },
    {
        rank: 3,
        name: 'Charlie',
        score: 1300,
        avatar: '/logo.jpeg?height=32&width=32',
        level: 3,
    },
    {
        rank: 4,
        name: 'David',
        score: 1200,
        avatar: '/logo.jpeg?height=32&width=32',
        level: 2,
    },
    {
        rank: 5,
        name: 'Eve',
        score: 1100,
        avatar: '/logo.jpeg?height=32&width=32',
        level: 1,
    },
]

export const api = {
    getPlayerData: () => {
        return new Promise<PlayerData>((resolve) => {
            setTimeout(() => resolve(playerData), 300)
        })
    },

    updatePlayerData: (newData: Partial<PlayerData>) => {
        return new Promise((resolve) => {
            playerData = { ...playerData, ...newData }
            setTimeout(() => resolve(playerData), 300)
        })
    },

    getLeaderboard: () => {
        return new Promise<LeaderboardData[]>((resolve) => {
            setTimeout(() => resolve(leaderboardData), 300)
        })
    },

    getAchievements: () => {
        return new Promise<Achievement[]>((resolve) => {
            setTimeout(() => resolve(playerData.achievements || defaultAchievements), 300)
        })
    },

    submitScore: (score: number) => {
        return new Promise((resolve) => {
            playerData.exp += score
            if (playerData.exp >= 1000) {
                playerData.level += 1
                playerData.exp -= 1000
            }
            // 更新排行榜
            const playerIndex = leaderboardData.findIndex((p) => p.name === playerData.name)
            if (playerIndex === -1) {
                leaderboardData.push({
                    rank: 0,
                    name: playerData.name,
                    score: score,
                    avatar: playerData.avatar ?? '',
                    level: playerData.level,
                })
            } else {
                if (playerIndex !== -1 && leaderboardData[playerIndex]) {
                    leaderboardData[playerIndex].score += score
                }
            }
            leaderboardData.sort((a, b) => b.score - a.score)
            leaderboardData.forEach((player, index) => {
                player.rank = index + 1
            })
            setTimeout(() => resolve(playerData), 300)
        })
    },
}
