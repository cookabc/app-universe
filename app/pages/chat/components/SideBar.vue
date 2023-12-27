<template>
  <div class="side-bar flex flex-col w-[var(--menu-width)] bg-[var(--ant-primary-color-2)] h-full">
    <div class="create-btn-box pt-5 pb-5 pr-6 pl-6">
      <a-button class="create-btn h-12 bg-white rounded-xl text-[var(--ant-primary-color)] text-lg font-medium" block
                @click="createNewChat">
        <template #icon>
          <plus-outlined/>
        </template>
        NEW
      </a-button>
    </div>
    <div class="history-session relative flex-1 overflow-y-auto">
      <div class="session-list py-2.5 relative">
        <template v-for="(sessions, key) of state.sessionList" :key="key">
          <div class="session-box mb-2.5" v-if="sessions.length">
            <h4 class="session-date text-[#d7d7d7] text-xs pl-6 sticky top-0 bg-[var(--ant-primary-color-2)] z-10 mb-0 pb-1">
              {{ key }}</h4>
            <ul class="list-none p-0 m-0">
              <li v-for="item in sessions" :key="item.id" :id="`session-${item.id}`"
                  class="session-item transition-all duration-300 font-normal h-11 text-sm text-[#fff] hover:text-[var(--font-color-333)] hover:bg-white"
                  :class="item.id === state.sessionId ? 'text-[var(--font-color-333)] bg-white' : ''"
                  @click="handleSwitchChat(item)">
                <div v-if="item.enableEdit" class="session-edit relative h-full flex items-center py-2.5 pl-7 pr-16">
                  <a-input ref="newSessionRef" v-model:value="state.newSessionName"
                           class="text-sm p-0 h-7 bg-[#f5f5f5]" @blur="handleInputBlur(item)"/>
                  <div class="session-operate absolute right-0">
                    <a-button type="text" size="small" class="text-[var(--font-color-333)]"
                              @click.stop="handleEditConfirm(item)">
                      <check-outlined/>
                    </a-button>
                    <a-button type="text" size="small" class="text-[var(--font-color-333)]">
                      <close-outlined/>
                    </a-button>
                  </div>
                </div>
                <div v-else-if="item.enableDelete"
                     class="session-delete relative h-full flex items-center py-2.5 pl-7 pr-16">
                  <div class="session-name flex items-center max-w-[100%]" :title="`Delete【${item.name}】`">
                    Delete【<span class="text-ellipsis overflow-hidden whitespace-nowrap flex-1">{{ item.name }}</span>】
                  </div>
                  <div class="session-operate absolute right-0">
                    <a-button type="text" size="small" class="text-[var(--font-color-333)]"
                              @click.stop="handleDeleteConfirm(key, item)">
                      <check-outlined/>
                    </a-button>
                    <a-button type="text" size="small" class="text-[var(--font-color-333)]"
                              @click.stop="handleDeleteCancel(item)">
                      <close-outlined/>
                    </a-button>
                  </div>
                </div>
                <div v-else class="session-link cursor-pointer relative h-full flex items-center py-2.5 px-7"
                     :class="item.id === state.sessionId  ? 'pr-16' : ''">
                  <div class="session-name overflow-hidden text-ellipsis whitespace-nowrap">{{ item.name }}</div>
                  <div class="session-operate absolute right-0"
                       :class="item.id === state.sessionId ? '' : 'hidden'">
                    <a-button type="text" size="small" class="text-[var(--font-color-333)]" title="Edit"
                              @click.stop="handleEdit(item)">
                      <edit-outlined/>
                    </a-button>
                    <a-button type="text" size="small" class="text-[var(--font-color-333)]" title="Edit"
                              @click.stop="handleDelete(item)">
                      <delete-outlined/>
                    </a-button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </template>
      </div>
      <div v-if="state.loading"
           class="absolute w-full h-[calc(100%-2.75rem-2rem)] bg-[var(--ant-primary-color-2)] top-[calc(2.75rem+2rem)] left-0 flex justify-center items-center text-white text-3xl">
        <loading-outlined/>
      </div>
    </div>
  </div>
</template>
<script setup>
import {reactive, ref, nextTick, computed, onMounted} from 'vue'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined
} from '@ant-design/icons-vue'
import {useSessionStore} from "~/store";

const route = useRoute()
const router = useRouter();
const sessionStore = useSessionStore()

const newSessionRef = ref('')
const state = reactive({
  loading: false,
  newSessionName: '',
  sessionId: computed(() => route.query.sessionId ? parseInt(route.query.sessionId) : ''),
  sessionList: computed(() => sessionStore.formattedSessionList()),
})

const getSessionList = async () => {
  try {
    state.loading = true
    await sessionStore.getSessionList()
    state.loading = false
  } catch (error) {
    console.warn('[ error ]-143', error)
  } finally {
    state.loading = false
  }
}

onMounted(async () => {
  await getSessionList()
  setTimeout(() => {
    document.getElementById(`session-${state.sessionId}`)?.scrollIntoView({
      behavior: 'auto',
      block: 'center',
      inline: 'center'
    })
  }, 300)
})

const handleSwitchChat = (item) => {
  if (item.id === state.sessionId) return
  router.push({
    path: '/chat',
    query: {sessionId: item.id},
  })
}

const handleEdit = (session) => {
  sessionStore.editSessionName(session)
  state.newSessionName = session.name
  nextTick(() => {
    newSessionRef.value[0].focus()
  })
}
let timer = null
const handleInputBlur = (item) => {
  timer = setTimeout(() => {
    handleEditCancel(item)
  }, 200);
}
const handleEditConfirm = async (item) => {
  clearTimeout(timer)
  const response = await sessionStore.doEditSessionName({
    id: item.id,
    name: state.newSessionName
  })
  if (response.code === 0) {
    sessionStore.editSessionNameDone({
      id: item.id,
      newName: state.newSessionName
    })
    state.newSessionName = ''
  }
}
const handleEditCancel = (item) => {
  sessionStore.editSessionName(item)
  state.newSessionName = ''
}

const handleDelete = (item) => {
  sessionStore.deleteSession(item)
}
const handleDeleteConfirm = async (key, item) => {
  await sessionStore.doDeleteSession({id: item.id})
  createNewChat()
}
const handleDeleteCancel = (item) => {
  sessionStore.deleteSession(item)
}

const createNewChat = () => {
  router.push({
    path: '/chat'
  })
}
</script>
<style lang="less">
.create-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}

.history-session {
  &-search {
    .ant-input-affix-wrapper {
      height: 100%;
      background-color: transparent;
      border-right: 0;
      border-left: 0;
      padding-left: 20px;
      padding-right: 20px;
      border-bottom-color: rgba(255, 255, 255, .7);
      border-top-color: rgba(255, 255, 255, .7);
      transition: all .28s;
      border-radius: 0;

      .ant-input-prefix {
        font-size: 16px;
        color: #d7d7d7;
      }

      &:focus,
      &-focused {
        box-shadow: none;
      }

      &:focus,
      &-focused,
      &:hover {
        border-bottom-color: rgba(255, 255, 255, 1);
        border-top-color: rgba(255, 255, 255, 1);
      }

      &:hover {
        border-right: 0;
        border-left: 0;
      }

      .ant-input {
        font-size: 16px;
        color: #fff;
        background-color: transparent;
      }
    }
  }
}

.side-bar-spin {
  .ant-spin-container {
    opacity: 1;
    background-color: var(--ant-primary-color-2);
  }

  .ant-spin-blur {
    &::after {
      opacity: 1;
    }
  }
}
</style>
