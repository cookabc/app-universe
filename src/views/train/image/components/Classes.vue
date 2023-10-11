<template>
  <div px-30 relative>
    <div w-590 h-full pt-80 pb-50>
      <div v-for="(item, index) in classes" :key="item.id" bg-white rounded-10 shadow-2xl mb-30>
        <div flex items-center p-18 border-b="1px solid #dedede">
          <div v-if="item.isEditName" max-w-300px>
            <a-input :ref="setItemRef" @blur="handleSaveClassName(item)" @keydown.enter="handleSaveClassName(item)"
                     v-model:value="item.tempName" allow-clear/>
          </div>
          <div flex items-center v-else @click="handleEditClassName(item)">
            <h2 hover="text-blue" text-20 cursor-pointer flex-1 max-w-400px text-truncate :title="item.name">
              {{ item.name }}</h2>
            <a-button type="text" ml-4>
              <template #icon>
                <edit-outlined/>
              </template>
            </a-button>
          </div>
          <div ml-a flex items-center>
            <div v-if="item.disabled" text-red f-c-c font-500 gap-x-4 mr-10>已禁用
              <the-icon icon="solar:danger-triangle-bold" :size="20" ml-10/>
            </div>
            <a-dropdown trigger="click" placement="bottom" arrow>
              <span flex-shrink-0 cursor-pointer leading-none>
                <the-icon :size="24" icon="mingcute:more-2-fill"/>
              </span>
              <template #overlay>
                <a-menu @click="(e) => handleMenuClick(e, item)">
                  <a-menu-item v-for="option in actionOptions"
                               :disabled="(option.key === 'remove-all-samples' || option.key === 'download-samples') && item.samples.length === 0"
                               :key="option.key">{{ option.label }}
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
        <div px-18 pt-18 v-show="!item.showUpload && !item.showCamera">
          <h2 font-500 text-14 class="text-[#333]">
            <template v-if="item.samples.length === 0">添加图片样例</template>
            <template v-else>{{ item.samples.length }}个图片样例</template>
          </h2>
        </div>
        <div flex :class="item.showUpload || item.showCamera ? 'h-450px' : 'items-center'">
          <div p-18 pr-0 mr-6 whitespace-nowrap v-show="!item.showUpload && !item.showCamera">
            <button bg-blue-1 border-0 p-8 rounded-6 w-70px h-58px cursor-pointer align-middle hover="bg-blue-2"
                    transition-all duration-300 mr-6 class="text-#1967D2" @click="openCamera(item)">
              <the-icon icon="charm:camera" :size="24"/>
              <p>拍照</p>
            </button>
            <button bg-blue-1 border-0 p-8 rounded-6 w-70px h-58px cursor-pointer align-middle hover="bg-blue-2"
                    transition-all duration-300 class="text-#1967D2" @click="openUpload(item)">
              <the-icon icon="material-symbols:upload" :size="24"/>
              <p>上传图片</p>
            </button>
          </div>
          <div bg-blue-1 box-border v-if="item.showUpload"
               :class="item.showUpload ? 'flex-1 flex-col' : ' flex-shrink-0'">
            <div p-14 pb-0 flex items-center justify-between mb-12>
              <h4 text-14 class="text-[#1967D2]">File</h4>
              <close-outlined class="text-[#1967D2]" p-4 font-500 cursor-pointer @click="closeUpload(item)"/>
            </div>
            <div flex-col p-14 pt-0 flex-1>
              <a-upload-dragger
                  v-model:fileList="upload.list"
                  multiple
                  @change="(options) => handleUploadChange(options, item)"
                  :beforeUpload="handleBeforeUpload"
                  :show-upload-list="false"
                  :max-count="1"
              >
                <div flex-col justify-center bg-blue-2 border-0 p-8 my--16 rounded-6 w-full h-100px cursor-pointer
                     hover="bg-blue-3" transition-all duration-300 class="text-#1967D2">
                  <p text-30 leading-none mb-10>
                    <inbox-outlined/>
                  </p>
                  <p text-14 font-500>从文件中选择图片，或拖放至此处</p>
                </div>
              </a-upload-dragger>
              <div mt-a text-center mb-30>
                <svg role="img" width="167" height="39" viewBox="0 0 167 39" fill="none"
                     xmlns="http://www.w3.org/2000/svg"
                     aria-labelledby="title-hf1dSgY1dTsSWxRsTTo4qR desc-hf1dSgY1dTsSWxRsTTo4qR">
                  <path d="M86 13L84.59 14.41L88.17 18H76V20H88.17L84.59 23.59L86 25L92 19L86 13Z"
                        fill="#185ABC"></path>
                  <rect y="2" width="62" height="35" rx="1" fill="#AECBFA"></rect>
                  <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M62 14.7694V35C62 36.1046 61.1046 37 60 37H39.7694C38.0217 34.4358 37 31.3372 37 28C37 19.1634 44.1634 12 53 12C56.3372 12 59.4358 13.0217 62 14.7694Z"
                        fill="#4285F4"></path>
                  <rect x="11" y="2" width="33" height="24" fill="#8AB4F8"></rect>
                  <path d="M15.0001 14L28 37H2L15.0001 14Z" fill="#669DF6"></path>
                  <g opacity="0.4">
                    <rect x="105" y="2" width="62" height="35" rx="1" fill="#AECBFA"></rect>
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M167 14.7694V35C167 36.1046 166.105 37 165 37H144.769C143.022 34.4358 142 31.3372 142 28C142 19.1634 149.163 12 158 12C161.337 12 164.436 13.0217 167 14.7694Z"
                          fill="#4285F4"></path>
                    <rect x="116" y="2" width="33" height="24" fill="#8AB4F8"></rect>
                    <path d="M120 14L133 37H107L120 14Z" fill="#669DF6"></path>
                  </g>
                  <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="118" y="2" width="35" height="35">
                    <rect x="118" y="2" width="35" height="35" fill="#1967D2"></rect>
                  </mask>
                  <g mask="url(#mask0)">
                    <rect x="105" y="2" width="62" height="35" rx="1" fill="#AECBFA"></rect>
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M167 14.7694V35C167 36.1046 166.105 37 165 37H144.769C143.022 34.4358 142 31.3372 142 28C142 19.1634 149.163 12 158 12C161.337 12 164.436 13.0217 167 14.7694Z"
                          fill="#4285F4"></path>
                    <rect x="116" y="2" width="33" height="24" fill="#8AB4F8"></rect>
                    <path d="M120 14L133 37H107L120 14Z" fill="#669DF6"></path>
                  </g>
                  <rect x="117" y="1" width="37" height="37" stroke="#1967D2" stroke-width="2"></rect>
                </svg>
                <p text-14 text-blue font-500 mt-5 tracking-widest>图像将裁剪为方形</p>
              </div>
            </div>
          </div>
          <div bg-blue-1 box-border v-if="item.showCamera"
               :class="item.showCamera ? 'flex-1 flex-col' : ' flex-shrink-0'">
            <div p-14 pb-0 flex items-center justify-between mb-12>
              <h4 text-14 class="text-[#1967D2]">相机</h4>
              <close-outlined class="text-[#1967D2]" p-4 font-500 cursor-pointer @click="closeCamera(item)"/>
            </div>
            <div px-14>
              <web-camera @take-photos="(data) => onTakePhotos(data, item)" w-265px/>
            </div>
          </div>
          <div h-full flex-col class="w-[calc(100%-170px)]"
               :class="item.showUpload || item.showCamera ? 'flex-1' : ' flex-shrink-0'">
            <h3 p-15 text-14 v-show="item.showUpload || item.showCamera">
              <template v-if="item.samples.length === 0">添加图片样例</template>
              <template v-else>{{ item.samples.length }}个图片样例</template>
            </h3>
            <div
                :class="item.showUpload || item.showCamera ? 'overflow-y-auto h-[calc(100%-60px)] px-10 samples-box' : 'overflow-x-auto whitespace-nowrap pt-10 py-4 samples-box'"
                text-0>
              <div v-for="(sample, sIndex) in item.samples" :key="sample.id" inline-block flex-shrink-0 relative
                   w-58px h-58px rounded-4 overflow-hidden cursor-pointer class="group"
                   :class="item.showUpload || item.showCamera ? 'm-4' : 'mr-4'">
                <delete-filled absolute right-0 top-0 text-white text-20 invisible select-none
                               class="group-hover:visible" @click="removeSample(item, sIndex)"/>
                <img :src="sample.src" alt="" object-contain block wh-full/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <a-button type="dashed" ghost block size="large" @click="handleAddClass" mb-20
                class="!text-20 !h-80 !border-gray !text-gray hover:!border-blue hover:!text-blue">
        <template #icon>
          <plus-square-outlined/>
        </template>
        Add a class
      </a-button>
    </div>
  </div>
</template>
<script setup>
import {CloseOutlined, DeleteFilled, EditOutlined, InboxOutlined, PlusSquareOutlined} from '@ant-design/icons-vue'
import {computed, reactive, ref} from "vue";
import {useTrainImageStore} from '@/store'
import WebCamera from './WebCamera.vue'
import {_nanoid, compressImage} from "@/utils";

const trainImageStore = useTrainImageStore()
const actionOptions = ref([
  {
    key: 'delete',
    label: '删除'
  },
  // {
  //   key: 'toggle',
  //   label: '禁用'
  // },
  {
    key: 'remove-all-samples',
    label: '删除所有样例',
    disabled: false
  },
  // {
  //   key: 'download-samples',
  //   label: '下载样例',
  //   disabled: false
  // }
])
const classes = computed(() => trainImageStore.classes)
const actionMap = new Map([
  [
    'delete',
    (item) => {
      trainImageStore.removeClass(item)
    }
  ],
  [
    'toggle',
    (item) => {
      item.disabled = !item.disabled
      const toggleItem = actionOptions.value.find(option => option.key === 'toggle')
      console.log('[ toggleItem ]-157', toggleItem)
      toggleItem.label = item.disabled ? '启用' : '禁用'
    }
  ],
  [
    'remove-all-samples',
    (item) => {
      item.samples = []
    }
  ],
  [
    'download-samples',
    (item) => {
      console.log('[ download ]-70', item)
    }
  ]
])

function handleMenuClick(e, item) {
  const actionFn = actionMap.get(e.key)
  typeof actionFn === 'function' && actionFn(item)
}

const openUpload = (item) => {
  trainImageStore.classes.forEach(c => c.showUpload = false)
  item['showUpload'] = true
}
const closeUpload = (item) => {
  item['showUpload'] = false
}
const openCamera = (item) => {
  trainImageStore.classes.forEach(c => c.showCamera = false)
  item['showCamera'] = true
}
const closeCamera = (item) => {
  item['showCamera'] = false
}
const upload = reactive({
  list: []
})
const handleBeforeUpload = () => false
const handleUploadChange = async ({file, fileList}, item) => {
  try {
    const reader = new FileReader()
    reader.addEventListener("load", async function () {
      const compressUrl = await compressImage(reader.result, 224, 224)
      item.samples.unshift({
        id: _nanoid(),
        src: compressUrl,
        label: item.handledName,
      })
    }, false)
    if (file) {
      reader.readAsDataURL(file)
    }
  } catch (error) {
    console.log('[ error ]-168', error)
  }
}
const onTakePhotos = async (data, item) => {
  const compressUrl = await compressImage(data.image_data_url, 224, 224)
  item.samples.unshift({
    id: _nanoid(),
    src: compressUrl,
    label: item.handledName
  })
}
const handleAddClass = () => {
  trainImageStore.addClass()
}
let itemRefs = []
const setItemRef = el => {
  if (el) {
    itemRefs.push(el)
  }
}

const handleSaveClassName = (item) => {
  if (item.tempName) {
    item.name = item.tempName
    item.handledName = item.tempName.replaceAll(' ', '_')
    item.tempName = ''
  }
  item.isEditName = false
  itemRefs = []
}
const handleEditClassName = async (item) => {
  item.isEditName = true
  item.tempName = item.name
  item.samples.forEach(sample => sample.label = item.handledName)
  await nextTick()
  itemRefs[0]?.select()
  itemRefs = []
}
const removeSample = (item, index) => {
  item.samples.splice(index, 1)
}
</script>
<style lang="less">
.samples-box {
  scrollbar-color: #AECBFA rgba(255, 255, 255, 0);
  scrollbar-width: thin;

  ::-webkit-scrollbar-thumb {
    // @apply bg-blue-3;
    background-color: rgb(147, 197, 253)
  }

  /* Let's get this party started */

  &::-webkit-scrollbar {
    width: 8px;
    height: 6px;
  }

  /* Track */

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0);
    -webkit-border-radius: 5px;
    border-radius: 5px;
  }

  /* Handle */

  &::-webkit-scrollbar-thumb {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    background: #AECBFA;
    /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); */
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #3474E0;
  }
}
</style>
<style>
</style>
