"use server";

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
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
