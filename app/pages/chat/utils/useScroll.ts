import {nextTick, ref} from 'vue'

export const scrollRef = ref({
    scrollTop: 0,
    scrollHeight: 0,
    clientHeight: 0
})

export const scrollToBottom = async () => {
    await nextTick()
    if (scrollRef.value)
        scrollRef.value.scrollTop = scrollRef.value.scrollHeight
}

export const scrollToTop = async () => {
    await nextTick()
    if (scrollRef.value)
        scrollRef.value.scrollTop = 0
}

export const scrollToBottomIfAtBottom = async () => {
    await nextTick()
    if (scrollRef.value) {
        const threshold = 100 // 阈值，表示滚动条到底部的距离阈值
        const distanceToBottom = scrollRef.value.scrollHeight - scrollRef.value.scrollTop - scrollRef.value.clientHeight
        if (distanceToBottom <= threshold)
            scrollRef.value.scrollTop = scrollRef.value.scrollHeight
    }
}
