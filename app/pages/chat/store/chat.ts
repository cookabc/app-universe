import {defineStore} from 'pinia'
import {getChatList, makeChat} from "~/composables/chat";
import {getDefaultPrompts} from "~/composables/prompt";
import {Message} from "~/types/message";

export const useChatStore = defineStore('chat', {
    state: () => ({
        messages: [] as Message[],
        defaultPrompts: []
    }),
    getters: {},
    actions: {
        async getMessageList(sessionId: string) {
            try {
                const response = await getChatList(sessionId)
                if (response.code === 0) {
                    this.messages = response.data
                }
            } catch (error) {
                console.warn('[ getMessageList error ]', error)
            }
        },
        setMessageList(messages: never[]) {
            this.messages = messages
        },
        async loadDefaultPrompts() {
            try {
                if (this.defaultPrompts.length > 0) {
                    return
                }
                const response = await getDefaultPrompts()
                if (response.code === 0) {
                    this.defaultPrompts = response.data || []
                } else {
                    this.defaultPrompts = []
                }
            } catch (error) {
                console.warn('[ loadDefaultPrompts error ]', error)
            }
        },
        async sendMessage(payload: any) {
            try {
                const response = await makeChat(payload)
                if (response.code === 0) {
                    this.messages.push({
                        ...payload,
                        response: response.data
                    })
                }
            } catch (error) {
                console.warn('[ sendMessage error ]', error)
            }
        }
    }
})
