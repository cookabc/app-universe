import {Response} from "~/types/response";

// 获取会话列表
export async function getSessionList() {
    return await $fetch('/session/list', {
        baseURL: useRuntimeConfig().public.apiBase,
    }) as Response
}

export async function editSessionName(body: any) {
    return await $fetch('/session/name', {
        baseURL: useRuntimeConfig().public.apiBase,
        method: 'PUT',
        body: body,
    }) as Response
}

// 删除一个会话
export async function deleteSession(body: any) {
    return await $fetch('/session/delete', {
        baseURL: useRuntimeConfig().public.apiBase,
        method: 'DELETE',
        body: body,
    }) as Response
}
