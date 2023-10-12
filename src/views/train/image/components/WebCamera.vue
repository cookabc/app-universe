<template>
  <div v-bind="$attrs" class="webcamera-box" mx-a>
    <div w-full rounded-10 overflow-hidden relative>
      <div ref="webcamRef"></div>
      <button id="flip-button" class="webcam-button group" top-5px right-5px flex-row-reverse @click="onFlipCamera">
        <svg id="flip-icon" ml-5px xmlns="http://www.w3.org/2000/svg" width="18" height="22" viewBox="0 0 20 24"
             fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd"
                d="M11.1114 24H8.88916V0H11.1114V24ZM0 19.6363V4.36358C0 3.16358 1 2.18176 2.22222 2.18176H6.66667V4.36358H2.22222V19.6363H6.66667V21.8181H2.22222C1 21.8181 0 20.8363 0 19.6363ZM17.7773 8.72711H19.9996V6.54529H17.7773V8.72711ZM13.333 21.8182H15.5552V19.6364H13.333V21.8182ZM17.7773 2.18176V4.36358H19.9996C19.9996 3.16358 18.9996 2.18176 17.7773 2.18176ZM17.7773 17.4544H19.9996V15.2726H17.7773V17.4544ZM15.5552 4.36358H13.333V2.18176H15.5552V4.36358ZM17.7773 13.0909H19.9996V10.9091H17.7773V13.0909ZM19.9996 19.6364C19.9996 20.8364 18.9996 21.8182 17.7773 21.8182V19.6364H19.9996Z"
                fill="white"></path>
        </svg>
        <span class="button-text" group-hover="visible block">Flip Camera</span>
      </button>
      <div wh-full absolute w-full top-0 left-0 z-3 cursor-pointer v-show="isCroping" id="container">
        <div absolute w-198 h-198 border="2px solid white"
             class="left-[calc((100%-198px)/2)] top-[calc((100%-198px)/2)]" id="draggable" cursor-move>
          <span class="crop-handle-grabber bottom-right" cursor-nwse-resize bottom--16 right--16></span>
          <span class="crop-handle-grabber top-left" cursor-nwse-resize top--16 left--16></span>
          <span class="crop-handle-grabber top-right" cursor-nesw-resize top--16 right--16></span>
          <span class="crop-handle-grabber bottom-left" cursor-nesw-resize bottom--16 left--16></span>
        </div>
      </div>
    </div>
    <long-press-button v-if="props.showLongPressBtn && !isCroping" type="primary" btn-text="长按连拍" block h-40 mt-10
                       tracking-widest @long-press="handleLongPress"/>
    <a-button v-show="isCroping" type="primary" @click="onCroppableWebcam" block h-40 mt-10 tracking-widest>确定裁剪
    </a-button>
  </div>
</template>
<script setup>
import {Webcam} from '@teachablemachine/image/dist'
import LongPressButton from '@/components/LongPressButton.vue'

const props = defineProps({
  autoStart: {
    type: Boolean,
    default: false
  },
  showLongPressBtn: {
    type: Boolean,
    default: true
  },
  videoWidth: {
    type: Number,
    default: 265
  },
  videoHeight: {
    type: Number,
    default: 265
  }
})
const video = ref()
const webcamRef = ref()
const emits = defineEmits(['auto-take-photos', 'take-photos', 'start'])
let webcam

async function loop() {
  webcam.update(); // update the webcam frame
  // await predict();
  window.requestAnimationFrame(loop);
}

const handleLongPress = () => {
  let image_data_url = webcam.canvas.toDataURL('image/jpeg')
  onTakePhoto({
    image_data_url
  })
}

const onTakePhoto = (data) => {
  emits('take-photos', data)
}
let intervalId
const onAutoTakePhoto = () => {
  intervalId = setInterval(() => {
    let image_data_url = webcam.canvas.toDataURL('image/jpeg')
    emits('auto-take-photos', {
      image_data_url
    })
  }, 20)
}
const onFlipCamera = () => {
  webcam.flip = !webcam.flip
  webcam.update()
}
const isCroping = ref(false)
const onCropCamera = async () => {
  isCroping.value = true
  // webcam.update()
  // await nextTick()
  // handleCrop()
  setTimeout(handleCrop, 300)
}
const onCroppableWebcam = async () => {
}
const handleCrop = () => {
  const container = document.getElementById('container');
  const draggable = document.getElementById('draggable');
  const containerRect = container.getBoundingClientRect()
  let isDragging = false;
  let offsetX, offsetY;
  draggable.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - draggable.getBoundingClientRect().left;
    offsetY = e.clientY - draggable.getBoundingClientRect().top;

    document.addEventListener('mousemove', moveElement)
    document.addEventListener('mouseup', stopDragging)
    container.style.userSelect = 'none'; // 防止选中文本
  });

  function moveElement(e) {
    if (isDragging) {
      const x = e.clientX - offsetX - containerRect.left
      const y = e.clientY - offsetY - containerRect.top
      const maxX = container.clientWidth - draggable.clientWidth
      const maxY = container.clientHeight - draggable.clientHeight
      const moveX = Math.min(Math.max(x, 0), maxX);
      const moveY = Math.min(Math.max(y, 0), maxY);
      draggable.style.left = moveX + 'px'
      draggable.style.top = moveY + 'px'
    }
  }

  function stopDragging() {
    isDragging = false
    document.removeEventListener('mousemove', moveElement)
    document.removeEventListener('mouseup', stopDragging)
    container.style.userSelect = 'auto'; // 恢复文本选中
  }

  const cropHandleGrabbers = draggable.querySelectorAll('.crop-handle-grabber');

  let isResizing = false;
  let originalX;
  let originalY;
  let originalWidth;
  let originalHeight;

  cropHandleGrabbers.forEach(handle => {
    handle.addEventListener('mousedown', (e) => {
      e.stopPropagation()
      isResizing = true;
      originalX = e.clientX;
      originalY = e.clientY;
      originalWidth = parseFloat(getComputedStyle(draggable, null).getPropertyValue('width'));
      originalHeight = parseFloat(getComputedStyle(draggable, null).getPropertyValue('height'));
    });

    document.addEventListener('mousemove', (e) => {
      e.stopPropagation()
      if (!isResizing) return;
      const deltaX = e.clientX - originalX;
      const deltaY = e.clientY - originalY;
      let width = originalWidth + deltaX;
      if (width > 265) {
        width = 265
      } else if (width < 64) {
        width = 64
      }
      let height
      if (handle.classList.contains('bottom-right') || handle.classList.contains('top-left')) {
        height = originalHeight + deltaY;
      } else {
        height = originalHeight - deltaY;
      }
      const aspectRatio = originalWidth / originalHeight;
      const newHeight = width / aspectRatio;
      draggable.style.width = width + 'px';
      draggable.style.height = newHeight + 'px';
    });

    document.addEventListener('mouseup', () => {
      isResizing = false;
    })
  });
}

onMounted(async () => {
  const flip = true; // whether to flip the webcam
  webcam = new Webcam(265, 265, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  webcam.play();
  window.requestAnimationFrame(loop);
  // append elements to the DOM
  webcamRef.value.appendChild(webcam.canvas)
  if (props.autoStart) {
    onAutoTakePhoto()
  }
})
const stop = () => {
  webcam.stop()
}
const clearAutoTakePhoto = () => {
  clearInterval(intervalId)
  intervalId = null
}
onUnmounted(() => {
  stop()
  if (props.autoStart) {
    clearAutoTakePhoto()
  }
})
defineExpose({
  stop,
  clearAutoTakePhoto
})
</script>
<style lang="less">
.webcamera-box {
  canvas {
    display: block;
  }

  .webcam-button {
  @apply absolute flex items-center h-34px py-5px px-8px bg-transparent border-0 rounded-5px z-2 cursor-pointer;

    &:hover,
    &:focus {
    @apply bg-black bg-opacity-70;
    }
  }

  .button-text {
  @apply hidden text-white text-16px font-600;
  }
}

#crop-rect {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  cursor: pointer;
}

#crop-rect-pan {
  fill: rgba(255, 255, 255, 0);
  stroke: white;
  stroke-width: 2;
}

.crop-handle-grabber {
@apply absolute w-46px h-46px f-c-c;
  // stroke: transparent;
  // fill: transparent;
  &:after {
  @apply content-empty w-16 h-16 bg-white;
  }
}

.crop-handle {
  fill: white;
}
</style>
