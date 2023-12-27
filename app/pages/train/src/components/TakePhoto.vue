<template>
  <div relative text-center py-2>
    <video id="video" :width="PIC_SIZE" :height="PIC_SIZE" autoplay></video>
    <canvas absolute top-0 left-0 z--1 id="canvas" :width="PIC_SIZE" :height="PIC_SIZE"></canvas>
    <div absolute wh-full top-0 left-0 bg-white z-1 f-c-c v-if="!mediaStreamTrack">
      <loading-outlined text-3xl/>
    </div>
  </div>
</template>
<script setup>
import {LoadingOutlined} from '@ant-design/icons-vue'

const mediaStreamTrack = ref(null)
const PIC_SIZE = 400
let video = null

function openMedia() {
  const constraints = {
    video: {width: PIC_SIZE, height: PIC_SIZE},
    audio: false
  }
  //获得video摄像头
  video = document.getElementById('video')
  const promise = navigator.mediaDevices.getUserMedia(constraints);
  promise.then((mediaStream) => {
    mediaStreamTrack.value = mediaStream.getVideoTracks()
    video.srcObject = mediaStream;
    video.play()
  });
}

// 拍照
function takePhoto(cb) {
  //获得Canvas对象
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, PIC_SIZE, PIC_SIZE);
  // toDataURL  ---  可传入image/png'---默认, 'image/jpeg'
  const img = document.getElementById('canvas').toDataURL()
  typeof cb === 'function' && cb(img)
  // closeMedia()
}

// 关闭摄像头
function closeMedia(cb) {
  const stream = video.srcObject
  let tracks = stream.getTracks()

  tracks.forEach(function (track) {
    track.stop();
  });
  mediaStreamTrack.value = null
  video.srcObject = null
  typeof cb === 'function' && cb()
}

defineExpose({
  takePhoto,
  closeMedia
})
onMounted(() => {
  openMedia()
})
</script>
