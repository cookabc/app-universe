import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCallback, useState } from "react";

export const LoginDialog = ({
	platform,
	onSubmit,
}: {
	platform: "x" | "weibo";
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
	const { toast } = useToast();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			const formData = new FormData(e.currentTarget);
			const username = formData.get("username") as string;
			const password = formData.get("password") as string;

			if (username && password) {
				toast({
					title: "Login Success",
					description: `Welcome back, ${username} to ${platform === "x" ? "X" : "Weibo"}.`,
				});
			} else {
				toast({
					title: "Login Failed",
					description: "Please enter your username and password.",
					variant: "destructive",
				});
			}
		},
		[platform, toast],
	);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="w-full mb-4">登录到 X</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>登录到 X</DialogTitle>
					<DialogDescription>
						请输入您的用户名和密码登录您的 X 账户。
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleLogin}>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="username" className="text-right">
								用户名
							</Label>
							<Input
								id="username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="password" className="text-right">
								密码
							</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="col-span-3"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="submit">登录</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
