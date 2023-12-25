<template>
  <div class="flex flex-wrap -mx-4" v-if="prompts.length">
    <div class="2xl:w-1/5 xl:w-1/4 lg:w-1/3 md:w-1/2 sm:w-full w-full px-4 mb-8" v-for="prompt in prompts"
         :key="prompt.id">
      <div
          class="prompt-item flex flex-col bg-white rounded-lg shadow-[4px_4px_4px_#D7D7D7] p-5 h-[300px] overflow-hidden"
          v-if="prompt">
        <div class="prompt-header flex items-center mb-5">
          <h3 class="prompt-title flex-grow flex-shrink basis-4/5 text-[var(--ant-primary-color)] font-semibold mb-0 overflow-hidden whitespace-nowrap text-ellipsis"
              :title="prompt.title">{{ prompt.title }}</h3>
        </div>
        <p class="prompt-subtitle text-sm text-[var(--ant-primary-color)]">{{ prompt.summary }}</p>
        <div
            class="prompt-content text-sm text-justify mb-3 h-[calc(100% - 160px)] overflow-y-auto text-[var(--font-color-333)]">
          {{ prompt.prompt }}
        </div>
        <div class="prompt-btns flex items-center justify-between mt-auto">
          <a-tag :title="prompt.category" class="max-w-[80%] overflow-hidden whitespace-nowrap text-ellipsis">
            {{ prompt.category }}
          </a-tag>
          <a-button type="primary" shape="round" @click="goChat(prompt)">CHAT
            <swap-right-outlined/>
          </a-button>
        </div>
      </div>
    </div>
  </div>
  <div class="mt-3" v-else>
    <a-empty/>
  </div>
</template>
<script setup>
import {SwapRightOutlined} from '@ant-design/icons-vue'

defineProps({
  prompts: {
    type: Array,
    default: () => []
  }
})

const router = useRouter()
const goChat = (prompt) => {
  router.push({
    path: '/chat',
    query: {
      promptId: prompt.id
    }
  })
}
</script>
<style scoped lang="less">
.prompt-title {
  font-size: 18px;
}

.prompt-subtitle {
  margin-bottom: 15px;
}

.prompt-item {
  max-width: 550px;
}
</style>
