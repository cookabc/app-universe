export interface Post {
	id: number;
	user: {
		name: string;
		username: string;
		avatar: string;
	};
	content: string;
	likes: number;
	retweets?: number;
	reposts?: number;
	comments: number;
}

export const generateMockPosts = (
	platform: "x" | "weibo",
	count: number,
): Post[] => {
	return Array.from({ length: count }, (_, i) => ({
		id: new Date().getTime() + i,
		user: {
			name: `User ${i + 1}`,
			username: `user${i + 1}`,
			avatar: `/placeholder-user-${(i % 6) + 1}.jpg`,
		},
		content: `This is a sample ${platform === "x" ? "tweet" : "weibo post"} #${i + 1}`,
		likes: Math.floor(Math.random() * 100),
		...(platform === "x"
			? { retweets: Math.floor(Math.random() * 50) }
			: { reposts: Math.floor(Math.random() * 50) }),
		comments: Math.floor(Math.random() * 20),
	}));
};
