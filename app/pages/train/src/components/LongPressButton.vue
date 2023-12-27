<template>
  <a-button v-bind="$attrs" @mousedown="onMousedown" @mouseup="onMouseup" @mouseout="onMouseup">{{
      props.btnText
    }}
  </a-button>
</template>
<script setup>
const props = defineProps({
  btnText: {
    type: String,
    default: ''
  },
  interval: { // 两次触发之间的时间间隔
    type: Number,
    default: 24
  },
  delay: {// 长按开始后的延迟时间
    type: Number,
    default: 0
  }
})
let pressTimer = null // 用于存储计时器对象
let isLongPress = false
const emits = defineEmits(['long-press'])
const onMousedown = () => {
  isLongPress = true
  setTimeout(triggerAction, props.delay)
}
const triggerAction = () => {
  clearTimeout(pressTimer)
  if (isLongPress) {
    emits('long-press')
    // 设置下一次计时器
    pressTimer = setTimeout(triggerAction, props.interval)
  }
}
const onMouseup = () => {
  clearTimeout(pressTimer)
  isLongPress = false
  pressTimer = null
}
</script>
