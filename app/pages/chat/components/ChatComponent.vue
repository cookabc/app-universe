<template>
  <div class="message-list py-4" id="scrollRef">
    <div v-if="state.loading" class="absolute w-full h-full flex justify-center items-center text-3xl">
      <loading-outlined/>
    </div>
    <div v-else>
      <template v-if="state.messages.length > 0" v-for="message of state.messages" :key="message.id">
        <div class="group message-item w-full">
          <div
              class="flex p-4 gap-2 text-base md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-5xl md:py-4 lg:px-0 m-auto">
            <div class="flex-shrink-0 flex flex-col relative items-end">
              <div class="w-10">
                <img src="@/assets/img/people.jpg" class="w-full h-full object-cover" alt=""/>
              </div>
            </div>
            <div class="message-content relative bg-[var(--ant-primary-color-3)] flex flex-col gap-1 md:gap-3 p-4
                      lg:w-[calc(100%-115px)] rounded-xl">
              <text-component :text="message?.prompt"/>
              <div class="flex">
                <a-button type="text" size="small" class="ml-auto" title="Copy" @click="onCopy(message.prompt)">
                  <copy-outlined/>
                </a-button>
              </div>
            </div>
          </div>
        </div>
        <div class="group message-item w-full">
          <div
              class="flex p-4 gap-2 text-base md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-5xl md:py-4 lg:px-0 m-auto">
            <div class="flex-shrink-0 flex flex-col relative items-end">
              <div class="w-10">
                <img src="@/assets/img/ai_robot.svg" class="w-full h-full object-cover" alt=""/>
              </div>
            </div>
            <div
                class="message-content relative flex w-[calc(100%-50px)] flex-col lg:w-[calc(100%-115px)] bg-white p-4 rounded-xl">
              <text-component :text="message?.response"/>
              <div class="flex">
                <a-button type="text" size="small" class="ml-auto" title="复制" @click="onCopy(message.response)">
                  <copy-outlined/>
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </template>
      <default-prompt v-else/>
    </div>
    <div class="h-32 md:h-48 flex-shrink-0"></div>
  </div>
</template>
<script setup>
import {nextTick, onMounted, reactive} from 'vue'
import {CopyOutlined, LoadingOutlined} from '@ant-design/icons-vue'
import {copyText} from '~/utils/copy'
import {message as Notify} from 'ant-design-vue'
import TextComponent from './TextComponent.vue'
import DefaultPrompt from "~/components/DefaultPrompt.vue";
import {useChatStore} from "~/store";

const route = useRoute()
const chatStore = useChatStore()

const state = reactive({
  loading: false,
  messages: computed(() => chatStore.messages),
  editValues: {}
})

watch(() => route.query.sessionId, async (newSessionId) => {
  await getChatList(newSessionId)
})

const getChatList = async (session_id) => {
  try {
    state.loading = true
    if (!session_id) {
      chatStore.setMessageList([])
      await chatStore.loadDefaultPrompts()
      return
    }
    await chatStore.getMessageList(session_id)
  } catch (error) {
    console.warn('[ getChatList error ]', error)
  } finally {
    state.loading = false
    await scrollToBottom()
  }
}

const onCopy = (content) => {
  const result = copyText(content)
  if (result) {
    Notify.success('复制成功');
  } else {
    Notify.error('复制失败');
  }
}

const scrollToBottom = async () => {
  await nextTick()
  const scrollRef = document.getElementById('scrollRef');
  scrollRef.scrollIntoView(false);
}

onMounted(async () => {
  await getChatList(route.query.sessionId)
})
</script>
<style scoped lang="less">
.ml-auto {
  padding-right: 0;
}
</style>
