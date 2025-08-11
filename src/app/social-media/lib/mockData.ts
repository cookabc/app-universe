import type { Post } from './types'

export function generateMockPosts(platform: 'x' | 'weibo', count: number): Post[] {
    const posts: Post[] = []
    for (let i = 0; i < count; i++) {
        posts.push({
            id: `${platform}-${Date.now()}-${i}`,
            user: {
                name: `User ${Math.floor(Math.random() * 1000)}`,
                username: `@user${Math.floor(Math.random() * 1000)}`,
                avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
            },
            content: `This is a mock post for ${platform}. ` + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'.repeat(Math.ceil(Math.random() * 3)),
            likes: Math.floor(Math.random() * 1000),
            retweets: platform === 'x' ? Math.floor(Math.random() * 500) : undefined,
            comments: Math.floor(Math.random() * 200),
            timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7).toISOString(),
        })
    }
    return posts
}
