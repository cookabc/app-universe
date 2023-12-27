<template>
  <div class="default-prompt message-item w-full mt-9">
    <div class="flex p-4 gap-2 text-base md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-5xl md:py-4 lg:px-0 m-auto">
      <div class="flex-shrink-0 flex flex-col relative items-end">
        <div class="w-14">
          <img src="@/assets/img/ai_robot.svg" class="w-full h-full object-cover" alt=""/>
        </div>
      </div>
      <div class="flex-1">
        <div class="greeting px-7 py-4 bg-[var(--ant-primary-color-3)] rounded-xl">
          <h2 class="greeting-title text-2xl text-[var(--ant-primary-color)] font-semibold mb-4">
            Hi there, I'm you AI assistant!
          </h2>
          <p class="text-base text-[#333] mb-0">I can answer your questions, provide information, and assist with your
            work.</p>
        </div>
        <h3 class="font-semibold text-base text-[#333] mt-6 mb-7">Try asking me like this:</h3>
        <ul class="list-none p-0 m-0">
          <li class="bg-white text-base cursor-pointer text-[#333] mb-6 px-5 py-1 rounded-xl"
              v-for="prompt of defaultPrompts" :key="prompt.id" @click="sendPromptMessage(prompt)">
            {{ prompt.prompt }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
import {computed} from 'vue'
import {useChatStore, useSessionStore} from "~/store";

const route = useRoute()
const chatStore = useChatStore()
const sessionStore = useSessionStore()
const defaultPrompts = computed(() => chatStore.defaultPrompts)

const sendPromptMessage = async (prompt) => {
  if (!prompt) return
  try {
    await chatStore.sendMessage({
      sessionId: route.query.sessionId,
      prompt: prompt.prompt,
      from_id: prompt.id
    })
    await sessionStore.getSessionList()
  } catch (error) {
    console.warn('[ sendPromptMessage error ] ', error)
  }
}
</script>
