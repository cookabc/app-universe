import {Response} from "~/types/response";

export async function getPromptList(name: string) {
    return await $fetch('/prompt/list', {
        baseURL: useRuntimeConfig().public.apiBase,
        query: {name: name}
    }) as Response
}

export async function getDefaultPrompts() {
    return await $fetch('/prompt/default', {
        baseURL: useRuntimeConfig().public.apiBase,
    }) as Response
}
