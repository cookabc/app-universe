"use client";

import { getQuestions } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Save } from "lucide-react";
import { useEffect, useState } from "react";

interface Question {
	id: number;
	text: string;
	type: string;
	options: string[];
}

const defaultQuestions: Question[] = [
	{
		id: 1,
		text: "你更喜欢独处还是和他人在一起?",
		type: "EI",
		options: ["更喜欢独处", "更喜欢和他人在一起"],
	},
	{
		id: 2,
		text: "你更关注现实还是可能性?",
		type: "SN",
		options: ["更关注现实", "更关注可能性"],
	},
	{
		id: 3,
		text: "你做决定时更依赖逻辑还是感受?",
		type: "TF",
		options: ["更依赖逻辑", "更依赖感受"],
	},
	{
		id: 4,
		text: "你更喜欢有计划还是随性而为?",
		type: "JP",
		options: ["更喜欢有计划", "更喜欢随性而为"],
	},
	{
		id: 5,
		text: "在社交场合，你通常是主动还是被动?",
		type: "EI",
		options: ["通常主动", "通常被动"],
	},
	{
		id: 6,
		text: "你更喜欢关注细节还是大局?",
		type: "SN",
		options: ["更关注细节", "更关注大局"],
	},
	{
		id: 7,
		text: "你更看重公平还是和谐?",
		type: "TF",
		options: ["更看重公平", "更看重和谐"],
	},
	{
		id: 8,
		text: "你更喜欢灵活应变还是提前计划?",
		type: "JP",
		options: ["更喜欢灵活应变", "更喜欢提前计划"],
	},
	{
		id: 9,
		text: "你更喜欢与人深入交流还是广泛接触?",
		type: "EI",
		options: ["更喜欢深入交流", "更喜欢广泛接触"],
	},
	{
		id: 10,
		text: "你更相信经验还是直觉?",
		type: "SN",
		options: ["更相信经验", "更相信直觉"],
	},
	{
		id: 11,
		text: "你更重视客观事实还是个人感受?",
		type: "TF",
		options: ["更重视客观事实", "更重视个人感受"],
	},
	{
		id: 12,
		text: "你更喜欢开放式结局还是明确结论?",
		type: "JP",
		options: ["更喜欢开放式结局", "更喜欢明确结论"],
	},
];

const typeDescriptions: Record<string, string> = {
	ISTJ: "尽责的检查员 - 安静、严肃、通过全面性和可靠性获得成功。实际，有序，事实型，有逻辑，真实可信赖。喜欢把一切都组织得井井有条。负责任，决定什么才是该做的，并为做好它而努力，不管遇到什么样的阻碍。",
	ISFJ: "温和的守护者 - 安静、友好、有责任心和良知。坚定地致力于完成他们的义务。全面、勤勉、精确，忠诚、体贴，留心和记得他们重视的人的小细节，关心他人的感受。努力把工作和家庭环境营造得有序而温馨。",
	INFJ: "善解人意的理想主义者 - 寻求思想、关系、物质等之间的意义和联系。希望了解什么能够激励人，对人有很强的洞察力。有责任心，坚持自己的价值观。对于怎样更好的服务大众有清晰的远景。在对于目标的实现过程中有计划而且果断坚定。",
	INTJ: "独立的战略家 - 在实现自己的想法和达成自己的目标时有创新的想法和非凡的动力。能很快洞察到外界事物间的规律并形成长期的远景计划。一旦决定做一件事就会开始规划并到完成为止。多、独立，对于自己和他人能力和表现的要求都非常高。",
	ISTP: "万能的分析师 - 灵活、忍耐力强，是个安静的观察者，直到有问题发生才会采取行动。善于分析问题发生的原因，能从大量的信息中很快的找到关键的症结所在。对于因果关系很感兴趣，用逻辑的方式分析问题，重视效率。",
	ISFP: "富同情心的艺术家 - 安静、友好、敏感、和善。欣赏眼前的和周围的事物。喜欢有自己的空间，喜欢按自己的时间表工作。忠诚、坚定地对待自己的价值观，对于自己所重视的人、事、物有坚定的承诺。不喜欢争论和冲突。不会将自己的观点或价值观强加于人。",
	INFP: "和谐的理想主义者 - 理想主义者，忠于自己的价值观及自己所重视的人。外在的生活与内在的价值观配合。好奇心重，很快看到事情的可能与否，能成为创意点子的催化剂。试图了解别人、协助他们发挥潜能。适应力强，有弹性；如果和他们的价值观没有抵触，他们会给予宽容与接纳。",
	INTP: "创新的逻辑学家 - 寻求提供对他们感兴趣的事物的逻辑解释。喜欢理论和抽象的事物，热衷于思考而非社交活动。安静、内向、灵活、适应力强。对于自己感兴趣的领域有超凡的集中精力深入分析问题的能力。多疑，有时会有点挑剔，喜欢用独特和创新的方式分析问题。",
	ESTP: "活跃的冒险家 - 灵活、忍耐力强，实际的问题解决者。注重当前，自发性强，享受每一个用感官把握当下的时刻。喜欢物质享受和时尚。学习新事物最有效的方式是通过亲身感受和练习。",
	ESFP: "随和的表演者 - 外向、友好、接受力强。热爱生活、人类和物质上的享受。喜欢与别人一起将事情做成功。在工作中讲究常识和实用性，并使工作富有乐趣。富有弹性、自然不做作，对新鲜事物容易产生好奇心。学习新的技能较容易，但不耐烦于课本中的理论。",
	ENFP: "热洋溢的创意家 - 热情洋溢、富有想象力。认为人生有很多的可能性。能很快地将事情和信息联系起来，然后很自信地根据自己的判断解决问题。总是需要得到别人的认可，也总是准备给与他人赞扬和支持。灵活、自然不做作，有很强的即兴发挥的能力和言语表达的能力。",
	ENTP: "大胆的思想家 - 反应快、睿智，有激励别人的能力，警觉性强、直言不讳。在解决新的、具有挑战性的问题时机智而有策略。善于找出理论上的可能性，然后再用战略的眼光分析。善于理解别人。不喜欢例行公事，很少会用相同的方法做相同的事情。",
	ESTJ: "高效的管理者 - 实际、现实主义者，天生的商人和技术人员。不感兴趣的事情不做，但当他们必须做时会很负责任地完成。喜欢组织和管理活动。长于制定可行的程序，能够胜任管理工作。重视传统和忠诚。希望把事情做好，并要求别人也这样做。",
	ESFJ: "友善的协调者 - 有爱心、有责任心、合作。希望周围的环境温馨而和谐，并为此果断地执行。喜欢与他人一起精确并及时地完成任务。事无巨细都会保持忠诚。能体察到他人在日常生活中的所需并竭尽全力帮助。希望自己和自己的所为能受到他人的认可和赏识。",
	ENFJ: "富有同情心的教导者 - 温暖、有同情心、反应敏捷、有责任心。非常注意别人的情绪、需求和动机。忠诚，对赞扬和批评都会积极地回应。爱交际，善于安排活动并为他人的成长创造便利条件。乐于合作，渴望得到肯定和认可。",
	ENTJ: "果断的领导者 - 坦诚、果断，有天生的领导能力。能很快看到公司/组织程序和政策中的不合理性和低效能性，发展并实施有效和全面的系统来解决问题。善于做期的计划和目标的设定。通常见多识广，博览群书，喜欢拓广自的知识面并此分享给���人。在陈述自己的想法时非常强而有力。",
};

export default function MBTITest() {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [answers, setAnswers] = useState<Record<number, string>>({});
	const [result, setResult] = useState<keyof typeof typeDescriptions | "">("");
	const [progress, setProgress] = useState(0);
	const [questions, setQuestions] = useState<Question[]>(defaultQuestions);
	const [useLLM, setUseLLM] = useState(false);
	const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

	useEffect(() => {
		const savedResult = localStorage.getItem("mbtiResult");
		if (savedResult) {
			setResult(JSON.parse(savedResult));
		}
	}, []);

	useEffect(() => {
		setProgress((Object.keys(answers).length / questions.length) * 100);
	}, [answers, questions.length]);

	useEffect(() => {
		if (useLLM) {
			generateLLMQuestions();
		} else {
			resetQuestions();
		}
	}, [useLLM]);

	const generateLLMQuestions = async () => {
		setIsGeneratingQuestions(true);
		try {
			const { questions: generatedQuestions } = await getQuestions(
				"Generate 12 MBTI test questions with options in Chinese",
			);
			if (generatedQuestions) {
				setQuestions(generatedQuestions as Question[]);
			}
			resetAnswers();
		} catch (error) {
			console.error("Error generating questions:", error);
			resetQuestions();
		}
		setIsGeneratingQuestions(false);
	};

	const resetQuestions = () => {
		setQuestions(defaultQuestions);
		resetAnswers();
	};

	const resetAnswers = () => {
		setAnswers({});
		setCurrentQuestion(0);
	};

	const handleAnswer = (value: string) => {
		setAnswers({ ...answers, [currentQuestion]: value });
		if (currentQuestion < questions.length - 1) {
			setCurrentQuestion(currentQuestion + 1);
		} else {
			calculateResult();
		}
	};

	const calculateResult = () => {
		const types = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
		for (const [questionId, answer] of Object.entries(answers)) {
			const question = questions[Number(questionId)];
			if (question) {
				const typeKey = question.type[
					answer === "0" ? 0 : 1
				] as keyof typeof types;
				types[typeKey]++;
			}
		}
		const mbtiType = `${types.E > types.I ? "E" : "I"}${types.S > types.N ? "S" : "N"}${types.T > types.F ? "T" : "F"}${types.J > types.P ? "J" : "P"}`;
		setResult(mbtiType);
		localStorage.setItem("mbtiResult", JSON.stringify(mbtiType));
	};

	const resetTest = () => {
		resetAnswers();
		setResult("");
		localStorage.removeItem("mbtiResult");
	};

	const saveResult = () => {
		if (result) {
			localStorage.setItem("mbtiResult", JSON.stringify(result));
			alert("结果已保存！");
		}
	};

	if (result) {
		return (
			<Card className="w-full max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle className="text-2xl">你的MBTI类型是: {result}</CardTitle>
					<CardDescription className="text-lg">
						{typeDescriptions[result] || "个性化描述"}
					</CardDescription>
				</CardHeader>
				<CardFooter className="flex justify-between">
					<Button onClick={resetTest}>重新测试</Button>
					<Button onClick={saveResult} className="flex items-center gap-2">
						<Save size={16} />
						保存结果
					</Button>
				</CardFooter>
			</Card>
		);
	}

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle className="text-2xl">MBTI人格测试</CardTitle>
				<CardDescription className="text-lg">
					问题 {currentQuestion + 1} / {questions.length}
				</CardDescription>
				<div className="flex items-center space-x-2 mt-4">
					<Switch
						id="use-llm"
						checked={useLLM}
						onCheckedChange={setUseLLM}
						disabled={isGeneratingQuestions}
					/>
					<Label
						htmlFor="use-llm"
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						使用AI生成问题
					</Label>
				</div>
			</CardHeader>
			<CardContent>
				<Progress value={progress} className="w-full mb-4" />
				{isGeneratingQuestions ? (
					<div className="text-center">正在生成问题，请稍候...</div>
				) : (
					<form>
						<div className="space-y-4">
							<Label className="text-lg">
								{questions[currentQuestion].text}
							</Label>
							<RadioGroup onValueChange={handleAnswer}>
								{questions[currentQuestion].options.map((option, index) => (
									<div
										key={`${questions[currentQuestion].id}-${index}`}
										className="flex items-center space-x-2"
									>
										<RadioGroupItem
											value={index.toString()}
											id={`option${questions[currentQuestion].id}-${index}`}
										/>
										<Label
											htmlFor={`option${questions[currentQuestion].id}-${index}`}
											className="text-base"
										>
											{option}
										</Label>
									</div>
								))}
							</RadioGroup>
						</div>
					</form>
				)}
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button
					onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
					disabled={currentQuestion === 0 || isGeneratingQuestions}
					className="flex items-center gap-2"
				>
					<AlertCircle size={16} />
					上一题
				</Button>
				<Button
					onClick={() =>
						currentQuestion === questions.length - 1
							? calculateResult()
							: handleAnswer("")
					}
					disabled={isGeneratingQuestions}
					className="flex items-center gap-2"
				>
					{currentQuestion === questions.length - 1 ? "查看结果" : "下一题"}
					<AlertCircle size={16} />
				</Button>
			</CardFooter>
		</Card>
	);
}
