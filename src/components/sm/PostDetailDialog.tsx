import { PostCard } from "@/components/sm/PostCard";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Post } from "@/lib/mockData";

export const PostDetailDialog = ({
	post,
	platform,
	onClose,
}: { post: Post; platform: "x" | "weibo"; onClose: () => void }) => {
	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>{post.content}</DialogTitle>
				</DialogHeader>
				<div className="py-4">
					<PostCard post={post} platform={platform} onClick={onClose} />
					<div className="mt-4">
						<h4 className="font-bold mb-2">{post.comments}</h4>
						<p>无评论</p>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={onClose}>关闭</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
