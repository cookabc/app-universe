export interface Post {
    id: string
    user: {
        name: string
        username: string
        avatar: string
    }
    content: string
    likes: number
    retweets?: number
    comments?: number
    timestamp: string
}
