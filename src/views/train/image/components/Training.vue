<template>
  <div h-10px sticky self-start class="top-50% translate-y--50%">
    <div f-c-c px-30 class="h-[calc(100vh-50px)] -mt-[calc((100vh-50px)/2)]">
      <div w-220px bg-white shadow-2xl rounded-10>
        <div p-18 border-b="1px solid #dedede">
          <h2 text-18 mb-18>训练</h2>
          <button relative z-1 block w-full border-0 p-10 rounded-8 cursor-pointer text-14 font-bold overflow-hidden
                  :disabled="isTrainBtnDisabled || isPreparing || isTraining"
                  :class="trainBtnClass"
                  @click="onTraining">
            <template class="text-[#666]" v-if="isTrained">模型训练完成</template>
            <template v-else>
              <template text-blue v-if="isPreparing || isTraining">训练中……</template>
              <template text-blue v-else>训练模型</template>
            </template>
            <div absolute top-0 left-0 wh-full pointer-events-none bg-blue-2 z--1
                 :style="{width: trainProcess + '%'}"></div>
          </button>
          <div v-if="isPreparing" pt-12 text-blue font-500 text-14>准备训练数据……</div>
          <div v-if="isTraining" pt-12 text-blue font-500 text-14>{{ trainTime }} - {{ epochRef }} / {{
              state.epochs
            }}
          </div>
        </div>
        <div flex items-center justify-between p-18 cursor-pointer font-500
             hover="bg-blue-1 outline outline-solid outline-blue text-blue" @click="openMoreArgs"
             :class="showMoreArgs ? 'text-blue' : 'text-gray rounded-b-10'">
          <span text-16>高级参数</span>
          <the-icon class="transition-all duration-300" :class="showMoreArgs ? 'rotate-x-180' : ''"
                    icon="solar:alt-arrow-down-bold" :size="18"/>
        </div>
        <div v-show="showMoreArgs">
          <div flex items-center p-18 gap-x-10 border-b="1px solid #dedede">
            <div text-14 font-bold>Epochs:</div>
            <a-input-number :min="1" :max="9999" v-model:value="state.epochs" :maxlength="4"/>
            <a-popover placement="bottom" title="Epochs:" overlay-class-name="training-popover w-300px">
              <template #content>
                <p>
                  一个周期意味着训练数据集中的每个样本至少被输入到训练模型一次。如果你将训练的周期数设置为50，例如，这意味着你正在训练的模型将会对整个训练数据集进行50次迭代。通常情况下，周期数越大，你的模型就会越好地学习如何预测数据。</p>
                <p>一般来说，你可能需要调整（通常是增加）这个数字，直到你的模型能够以较好的预测结果进行训练。</p>
              </template>
              <QuestionCircleOutlined text-gray ml-a/>
            </a-popover>
          </div>
          <div flex items-center p-18 gap-x-5 border-b="1px solid #dedede">
            <div text-14 font-bold>Batch Size:</div>
            <a-select v-model:value="state.batchSize" w-80 :options="batchSizeOptions"></a-select>
            <a-popover placement="bottom" title="Batch Size:" overlay-class-name="training-popover w-300px">
              <template #content>
                <p>一个批次（batch）是在训练的一个迭代中使用的一组样本。例如，假设你有80张图像，并选择批次大小为16。这意味着数据将被分成80
                  / 16 = 5个批次。一旦所有5个批次都经过模型处理，就会完成一个完整的周期（epoch）。</p>
                <p>通常情况下，你可能不需要调整这个数字来获得良好的训练结果。</p>
              </template>
              <QuestionCircleOutlined text-gray ml-a/>
            </a-popover>
          </div>
          <div flex flex-wrap items-center p-18 gap-x-10 border-b="1px solid #dedede">
            <div text-14 font-bold mb-8>Learning Rate:</div>
            <a-input-number style="width: 120px" :min="0.00001" :max="0.1" :step="0.00001"
                            v-model:value="state.learningRate" :maxlength="6"/>
            <a-popover placement="bottom" title="Learning Rate:" overlay-class-name="training-popover w-300px">
              <template #content>
                <p>要小心调整这个数字！即使是小小的变化也可能对你的模型学习效果产生巨大的影响。</p>
              </template>
              <QuestionCircleOutlined text-gray ml-a/>
            </a-popover>
          </div>
        </div>
      </div>
    </div>
    <div w-full h-2px absolute z--1 class="top-50% translate-y--50% bg-#bdc1c6"></div>
  </div>
  <div h-10px sticky self-start class="top-50% translate-y--50%">
    <div f-c-c px-30 overflow-y-auto class="h-[calc(100vh-50px)] -mt-[calc((100vh-50px)/2)]">
      <div w-300px bg-white rounded-10 shadow-2xl>
        <div p-18 border-b="1px solid #dedede">
          <h2 text-18>预览</h2>
        </div>
        <div flex items-center justify-between p-18>
          <a-switch v-model:checked="previewState.checked" @change="onSwitchChange" checked-children="开"
                    un-checked-children="关"/>
          <a-select
              ref="select"
              v-model:value="previewState.selectValue"
              style="width: 120px"
              @change="onSelectChange"
          >
            <a-select-option value="camera">相机</a-select-option>
            <a-select-option value="upload">上传图片</a-select-option>
          </a-select>
        </div>
        <template v-if="isTrained && previewState.checked">
          <div v-if="previewState.selectValue === 'upload'" px-30 pb-20>
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
            <div p-10>
              <img :src="uploadImgUrl" alt="" block w-full/>
            </div>
          </div>
          <div v-if="previewState.selectValue === 'camera'" px-30 pb-20>
            <web-camera
                ref="webCameraRef"
                :show-long-press-btn="false"
                :auto-start="previewState.autoStart"
                @start="onStart"
                :video-width="224"
                :video-height="224"
                @auto-take-photos="onAutoTakePhotos"/>
          </div>
          <div px-20 border-t="1px solid #dedede">
            <h2 text-18 py-8>输出</h2>
            <div v-for="(item, index) in resultList" flex items-center py-4 :key="index">
              <div w-80 flex-shrink-0 font-500 text-16px :style="{color: item.color}">{{ item.className }}</div>
              <div relative z-1 h-28 flex-1 rounded-5px overflow-hidden>
                <div relative rounded-5px wh-full pointer-events-none overflow-hidden transition-width duration-300
                     :style="{width: item.probability + '%', backgroundColor: item.color}">
                  <span absolute right-5 text-12 font-500 text-white
                        class="top-50% -translate-y-50%">{{ item.probability + '%' }}</span>
                </div>
                <div absolute wh-full inset-0 z--1 opacity-40 :style="{backgroundColor: item.color}"></div>
              </div>
            </div>
          </div>
        </template>
        <div p-16 text-center v-if="isTrained">
          <a-button size="large" w-200px type="primary" @click="goMakes">使用模型</a-button>
        </div>
      </div>
    </div>
    <div h-2px absolute z--1 left-0 right-30 class="top-50% translate-y--50% bg-#bdc1c6"></div>
  </div>
  <a-modal ref="makesRef"
           v-model:open="makesModalOpen"
           title="使用模型"
           width="100%"
           :footer="null"
           wrap-class-name="makesModal full-modal">
<!--    <makes @classify-image="onClassifyImage"/>-->
  </a-modal>
</template>
<script setup>
import {InboxOutlined, QuestionCircleOutlined} from '@ant-design/icons-vue'
import seedrandom from "seedrandom"
import WebCamera from './WebCamera.vue'
import * as tf from "@tensorflow/tfjs"
import {createTeachable} from '@teachablemachine/image/dist'
// import Makes from '@/views/project/makes/index.vue'
import {useProjectStore, useTrainImageStore} from '@/store'
import {_nanoid, compressImage} from "@/utils";

const trainImageStore = useTrainImageStore()
const projectStore = useProjectStore()
const makesModalOpen = ref(false)
const webCameraRef = ref()
const isTrainBtnDisabled = computed(() => trainImageStore.classes.map(item => item.name).length <= 1)
const trainBtnClass = computed(() => {
  if (isTrainBtnDisabled.value) {
    return 'cursor-not-allowed bg-gray-1 text-[#999]'
  } else {
    if (isPreparing.value && isTraining.value || isTrained.value) {
      return 'text-[#666] bg-gray-2'
    } else {
      return 'bg-blue-1 hover:bg-blue-2 text-blue'
    }
  }
})
const state = reactive({
  epochs: 50,
  batchSize: 16,
  learningRate: 0.001
})
const batchSize = [16, 32, 64, 128, 256, 512]
const batchSizeOptions = batchSize.map(item => {
  return {
    label: item,
    value: item
  }
})
const epochRef = ref(0)
const showMoreArgs = ref(false)
const openMoreArgs = () => {
  showMoreArgs.value = !showMoreArgs.value
}
const SEED_WORD = "runSuite";
const seed = seedrandom(SEED_WORD)

function loadPngImage(imgData) {
  return new Promise(async (resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.crossOrigin = "anonymous";
    [img.src] = await Promise.all([compressImage(imgData, 224, 224)]);
  });
}

function fisherYates(array, seed) {
  const length = array.length;
  const shuffled = array.slice(0);
  for (let i = length - 1; i > 0; i -= 1) {
    let randomIndex;
    if (seed) {
      randomIndex = Math.floor(seed() * (i + 1));
    } else {
      randomIndex = Math.floor(Math.random() * (i + 1));
    }
    [shuffled[i], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[i]
    ];
  }
  return shuffled;
}

async function gatherData(classes) {
  try {
    const trainAndValidationImages = []
    for (const label of classes) {
      let load = []
      const currentLabel = trainImageStore.classes.find(item => item.name === label)
      const imageList = fisherYates(currentLabel.samples, seed) // shuffle
      for (const img of imageList) {
        load.push(loadPngImage(img.src));
      }
      trainAndValidationImages.push(await Promise.all(load));
    }
    return trainAndValidationImages
  } catch (error) {
    console.log('[ error ]-150', error)
  }
}

async function trainModel(trainAndValidationImages, earlyStopEpoch) {
  earlyStopEpoch = state.epochs
  const classLabels = trainImageStore.classes.map(item => item.name)
  model.setLabels(classLabels)
  model.setSeed(SEED_WORD)
  const logs = []
  await tf.nextFrame().then(async () => {
    let index = 0
    for (const imgSet of trainAndValidationImages) {
      for (const img of imgSet) {
        await model.addExample(index, img);
      }
      index++;
    }
    const trainParams = {
      denseUnits: 100,
      epochs: state.epochs,
      learningRate: state.learningRate,
      batchSize: state.batchSize
    }
    await model.train(trainParams, {
      onEpochEnd: async (epoch, log) => {
        if (earlyStopEpoch !== state.epochs && earlyStopEpoch === epoch) {
          model.stopTraining().then(() => {
            console.log("Stopped training early");
          });
        }
        if (epoch === state.epochs - 1) {
          epoch = state.epochs
        }
        epochRef.value = epoch
        trainProcess.value = (epoch / state.epochs * 100).toFixed(0) * 1
        logs.push(log);
      },
      onTrainEnd: () => {
        // saveModel()
      }
    });
  })
  return logs[logs.length - 1];
}

const loadModel = () => {
  if (!modelPath.value) {
    hasModel.value = false
    return null
  }
  return new Promise(async resolve => {
    const loadOutput = await tf.loadLayersModel(modelPath.value)
    hasModel.value = true
    resolve(loadOutput)
  })
}
let model = null
const modelName = `ml4k-models-images-${_nanoid()}`
const trainProcess = ref(0)
const isTrained = ref(false)
const isPreparing = ref(false)
const isTraining = ref(false)
const isShow = ref(false)
const onTraining = async () => {
  try {
    webCameraRef.value?.stop()
    webCameraRef.value?.clearAutoTakePhoto()
    isTrained.value = false
    trainProcess.value = 0
    isPreparing.value = true
    const classLabels = trainImageStore.classes.map(item => item.name)
    const trainAndValidationImages = await gatherData(classLabels)
    trainImageStore.classes.forEach(item => {
      item.showUpload = false
      item.showCamera = false
    })
    isPreparing.value = false
    isTraining.value = true
    startTimer()
    const logs = await trainModel(trainAndValidationImages, 50)
    isTraining.value = false
    resetTimer()
    isShow.value = !!logs;
    resultList.value = trainImageStore.classes.map(item => {
      return {
        className: item.name,
        probability: 0,
        color: getRandomColor()
      }
    })
    isTrained.value = true
    trainProcess.value = 0
  } catch (error) {
    console.log('[ error ]-208', error)
  }
}

const emits = defineEmits(['model-loading', 'model-loaded'])
const createModel = async () => {
  emits('model-loading')
  model = await createTeachable({
    tfjsVersion: tf.version.tfjs,
    modelName
  }, {
    version: 2,
    alpha: 0.35
  })
  emits('model-loaded')
}
const trainTime = ref('00:00')
let startTime = 0; // 记录计时开始时间
let intervalId = null; // 用于存储计时器的ID
function updateTimer() {
  const currentTime = Math.floor((Date.now() - startTime) / 1000); // 计算经过的秒数
  const minutes = Math.floor(currentTime / 60).toString().padStart(2, '0'); // 分钟部分
  const seconds = (currentTime % 60).toString().padStart(2, '0'); // 秒钟部分
  trainTime.value = `${minutes}:${seconds}`;
}

function startTimer() {
  if (intervalId === null) {
    startTime = Date.now();
    intervalId = setInterval(updateTimer, 1000); // 每秒更新一次
  }
}

function stopTimer() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function resetTimer() {
  stopTimer()
  trainTime.value = '00:00'
}

const saveModel = async () => {
  const savaModelPath = `indexeddb://${modelName}`
  await model.save(savaModelPath)
}
const findMax = (data) => {
  return data.reduce((max, current) => {
    return current.probability > max.probability ? current : max;
  }, data[0])
}
const previewState = reactive({
  checked: true,
  selectValue: 'camera',
  autoStart: true
})
const upload = reactive({
  list: []
})
const onSwitchChange = (checked) => {
  webCameraRef.value?.clearAutoTakePhoto()
  previewState.autoStart = checked
}
const onSelectChange = () => {
  clearResultProbability()
}
const clearResultProbability = () => {
  resultList.value.forEach(item => {
    item.probability = 0
  })
}
const uploadImgUrl = ref('')
const handleBeforeUpload = () => false
const handleUploadChange = async ({file}) => {
  const reader = new FileReader()
  clearResultProbability()
  reader.addEventListener("load", async function () {
    uploadImgUrl.value = await compressImage(reader.result, 224, 224)
    await onTest(uploadImgUrl.value)
  }, false)
  if (file) {
    reader.readAsDataURL(file)
  }
}
const onAutoTakePhotos = async (data) => {
  const compressUrl = await compressImage(data.image_data_url, 224, 224)
  await onTest(compressUrl)
}
const resultList = ref([{}])
const onTest = async (testImage) => {
  try {
    testImage = await loadPngImage(testImage)
    const prediction = await model.predict(testImage, false)
    const result = findMax(prediction)
    createResult(result)
  } catch (e) {
    console.log('[ e ]-375', e)
    webCameraRef.value?.clearAutoTakePhoto()
  }
  // console.log('[ resultList.value ]-358', resultList.value)
}
const createResult = (result) => {
  resultList.value.forEach(item => {
    if (item.className === result.className) {
      item.probability = (result.probability * 100).toFixed(0) * 1
    } else {
      item.probability = ((1 - result.probability) * 100).toFixed(0) * 1
    }
  })
}
const onStart = () => {
  console.log('[ Preview ]-90', onStart)
}

function getRandomColor(alpha = 1) {
  const r = Math.floor(Math.random() * 256); // 生成0到255之间的随机整数
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

onMounted(() => {
  createModel()
})
const goMakes = () => {
  makesModalOpen.value = true
  projectStore.imgList = []
  projectStore.labels = trainImageStore.classes.map(item => {
    return {
      id: _nanoid(),
      label: item.name,
      handledLabel: item.name.replaceAll(' ', '_'),
      list: []
    }
  })
}
const onClassifyImage = async (fn) => {
  try {
    for (let i = 0; i < projectStore.imgList.length; i++) {
      const item = projectStore.imgList[i]
      const testImage = await loadPngImage(item.src)
      const prediction = await model.predict(testImage, false)
      const result = findMax(prediction)
      item.className = result.className
      item['handledClassName'] = result.className.replaceAll(' ', '_')
      item.probability = result.probability
    }
    if (typeof fn === 'function') {
      fn()
    }
  } catch (error) {
    console.log('[ error ]-471', error)
  }
}
</script>
<style lang="less">
.training-popover {
  --antd-arrow-background-color: #000;

  .ant-popover {
    &-title {
    @apply text-white;
    }

    &-inner {
    @apply bg-black;

      &-content {
      @apply text-white;
      }
    }
  }
}
</style>
