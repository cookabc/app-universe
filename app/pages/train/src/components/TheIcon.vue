<script setup>
import {h} from 'vue';
import {Icon as IconifyIcon} from '@iconify/vue'

const renderIcon = (icon, props = {size: 12}) => {
  return () => h('i',
      {
        role: 'img',
        class: 'iconify-icon',
        style: {
          color: props.color,
          fontSize: props.size + 'px'
        }
      },
      [
        h(IconifyIcon,
            {
              icon,
            }
        )
      ]
  )
}

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 14
  },
  color: {
    type: String,
    default: undefined
  },
  /** iconify | custom */
  type: {
    type: String,
    default: 'iconify'
  }
})

const iconCom = renderIcon(props.icon, {size: props.size, color: props.color})
</script>

<template>
  <component :is="iconCom"/>
</template>
