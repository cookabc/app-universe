// 获取历史对话
import {Response} from "~/types/response";

export async function getChatList(sessionId: string) {
    return await $fetch('/chat/list', {
        baseURL: useRuntimeConfig().public.apiBase,
        method: 'POST',
        query: {sessionId},
    }) as Response
}

// 对话
export async function makeChat(body: any) {
    return await $fetch('/chat/do', {
        baseURL: useRuntimeConfig().public.apiBase,
        method: 'POST',
        body: body,
    }) as Response
}
