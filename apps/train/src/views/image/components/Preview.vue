<template>
  <div w-300px bg-white rounded-10 shadow-2xl>
    <div p-18 border-b="1px solid #dedede">
      <h2 text-18>预览</h2>
    </div>
    <div p-18>
      <div flex items-center justify-between mb-18>
        <a-switch v-model:checked="state.checked" @change="onSwitchChange" checked-children="开"
                  un-checked-children="关"/>
        <a-select
            ref="select"
            v-model:value="state.selectValue"
            style="width: 120px"
        >
          <a-select-option value="camera">拍照</a-select-option>
          <a-select-option value="upload">上传图片</a-select-option>
        </a-select>
      </div>
      <div>
        <div v-if="state.selectValue === 'upload'">
          <a-upload-dragger
              v-model:fileList="upload.list"
              name="file"
              @change="handleUploadChange"
              :beforeUpload="handleBeforeUpload"
              :show-upload-list="false"
              :max-count="1"
          >
            <div flex-col justify-center bg-blue-1 border-0 p-8 my--16 rounded-6 w-full h-100px cursor-pointer
                 hover="bg-blue-2" transition-all duration-300 class="text-#1967D2">
              <p text-30 leading-none mb-10>
                <inbox-outlined/>
              </p>
              <p text-14 font-500>从文件中选择图片，或拖放至此处</p>
            </div>
          </a-upload-dragger>
          <div p-20 pb-0>
            <img :src="uploadImgUrl" alt="" block mx-a/>
          </div>
          <div>
            <h2>输出</h2>
            <div>

            </div>
          </div>
        </div>
        <web-camera
            v-if="state.selectValue === 'camera' && isTrained && state.checked"
            :show-long-press-btn="false"
            :auto-start="autoStart"
            @start="onStart"
            @auto-take-photos="onAutoTakePhotos"/>
      </div>
    </div>
  </div>
</template>
<script setup>
import {InboxOutlined} from '@ant-design/icons-vue'
import WebCamera from './WebCamera.vue'
import {useTrainImageStore} from '@/store/index.js'
import {compressImage} from "@/utils/index.js";

const trainImageStore = useTrainImageStore()
const isTrained = computed(() => trainImageStore.isTrained)
const autoStart = ref(true)
const state = reactive({
  checked: true,
  selectValue: 'camera'
})
const upload = reactive({
  list: []
})
const onSwitchChange = (checked) => {
  autoStart.value = checked
}
const uploadImgUrl = ref('')
const handleBeforeUpload = () => false
const handleUploadChange = async ({file}) => {
  const reader = new FileReader()
  reader.addEventListener("load", async function () {
    uploadImgUrl.value = await compressImage(reader.result, 224, 224)
  }, false)
  if (file) {
    reader.readAsDataURL(file)
  }
}
const onAutoTakePhotos = async (data) => {
  console.log('[ data ]-89', data)
  uploadImgUrl.value = await compressImage(data.image_data_url, 224, 224)
}
const onStart = () => {
  console.log('[ Preview ]-90', onStart)
}
</script>
