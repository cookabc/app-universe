import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import type { Post } from "@/lib/mockData";

export const PostCard = ({
	post,
	platform,
	onClick,
}: {
	post: Post;
	platform: "x" | "weibo";
	onClick: () => void;
}) => {
	return (
		<Card key={post.id} className="mb-4" onClick={onClick}>
			<CardHeader className="flex items-center space-x-4">
				<Avatar>
					<AvatarImage src={post.user.avatar} alt={`@${post.user.username}`} />
					<AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
				</Avatar>
				<div>
					<h3 className="font-bold">{post.user.name}</h3>
					<p className="text-sm text-gray-500">@{post.user.username}</p>
				</div>
			</CardHeader>
			<CardContent>
				<p>{post.content}</p>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button variant="ghost" size="sm">
					点赞 ({post.likes})
				</Button>
				<Button variant="ghost" size="sm">
					转发 ({platform === "x" ? post.retweets : post.reposts})
				</Button>
				<Button variant="ghost" size="sm">
					评论 ({post.comments})
				</Button>
			</CardFooter>
		</Card>
	);
};
