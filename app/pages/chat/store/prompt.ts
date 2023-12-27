import {defineStore} from 'pinia'
import {cloneDeep} from "lodash-es";
import {getPromptList} from "~/composables/prompt";

type Prompt = {
    id: number
    title: string
    category: string
    summary: string
    prompt: string
    hot: boolean
}

export const usePromptStore = defineStore('prompt', {
    state: () => ({
        promptList: [] as Prompt[],
    }),
    getters: {
        hotPromptList: (state) => state.promptList.filter(item => item.hot),
        allPromptOptions: (state) => [...new Set(state.promptList.map(item => item.category))],
        hotPromptOptions: (state) => [...new Set(state.promptList.filter(item => item.hot).map(item => item.category))],
    },
    actions: {
        async getPromptList(name = '') {
            try {
                const response = await getPromptList(name)
                this.promptList = cloneDeep(response.data) as Prompt[]
                return true
            } catch (error) {
                console.warn('[ getPromptList error ]', error)
                return false
            }
        },
    },
})
