"use server";

import { openai } from "@ai-sdk/openai";
import { generateObject, streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { z } from "zod";

const questionSchema = z.object({
	id: z.number(),
	text: z.string(),
	type: z.enum(["EI", "SN", "TF", "JP"]),
	options: z.array(z.string()).length(2),
});

const questionsSchema = z.object({
	questions: z.array(questionSchema),
});

export async function getQuestions(prompt: string) {
	const { object: questions } = await generateObject({
		model: openai("gpt-4o-mini"),
		prompt,
		schema: questionsSchema,
	});

	return questions;
}

export interface Message {
	role: "user" | "assistant";
	content: string;
}

export async function continueConversation(history: Message[]) {
	const stream = createStreamableValue();

	(async () => {
		const { textStream } = await streamText({
			model: openai("gpt-4o-mini"),
			// You are an AI assistant capable of generating artifacts. When asked to generate code, respond with "CODE_SNIPPET:" followed by the code, then "END_CODE_SNIPPET".
			system: "You are a helpful assistant capable of doing anything.",
			messages: history,
		});

		for await (const text of textStream) {
			stream.update(text);
		}

		stream.done();
	})();

	return {
		messages: history,
		newMessage: stream.value,
	};
}
