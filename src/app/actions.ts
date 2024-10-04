"use server";

import { openai } from "@ai-sdk/openai";
import { TranslationServiceClient } from "@google-cloud/translate";
import { generateObject, streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
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

export const translateText = async (
	text: string,
	fromLang: string,
	toLang: string,
): Promise<string> => {
	const translationClient = new TranslationServiceClient();
	if (!translationClient) {
		throw new Error("Translation client not initialized");
	}
	try {
		const response = await fetch(
			`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`,
		);
		const data = await response.json();
		if (data.responseStatus === 200) {
			return data.responseData.translatedText;
		}
		throw new Error(data.responseDetails);
	} catch (error) {
		console.error("Translation error:", error);
		throw new Error("Translation failed");
	}
};

export const japaneseConvert = async (
	text: string,
	fromType: string,
	toType: string,
): Promise<string> => {
	const kuroshiro = new Kuroshiro();
	await kuroshiro.init(new KuromojiAnalyzer());
	if (!kuroshiro) {
		throw new Error("Kuroshiro not initialized");
	}
	try {
		let result = text;

		if (fromType !== "kanji" && toType !== "kanji") {
			result = await kuroshiro.convert(text, {
				to: toType as "hiragana" | "katakana" | "romaji",
			});
		} else if (fromType === "kanji") {
			result = await kuroshiro.convert(text, {
				to: toType as "hiragana" | "katakana" | "romaji",
			});
		} else {
			// Converting to kanji is not directly supported, so we'll just return the original text
			result = text;
		}

		return result;
	} catch (error) {
		console.error("Japanese conversion error:", error);
		throw new Error("Japanese conversion failed");
	}
};
