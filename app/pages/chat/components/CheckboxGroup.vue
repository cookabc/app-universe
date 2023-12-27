<template>
  <div class="checkbox-list" v-if="options.length">
    <a-checkbox
        class="check-all"
        v-model:checked="state.checkAll"
        :indeterminate="state.indeterminate"
        @change="onCheckAllChange">
      ALL
    </a-checkbox>
    <a-checkbox-group v-model:value="state.checkedList" :options="options"/>
  </div>
</template>
<script setup>
import {reactive, watch} from 'vue'

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  }
})
const emits = defineEmits(['change'])
const state = reactive({
  checkedList: [],
  indeterminate: false,
  checkAll: false
})
const onCheckAllChange = (e) => {
  Object.assign(state, {
    checkedList: e.target.checked ? props.options : [],
    indeterminate: false
  })
}
const clearCheckedList = () => {
  state.checkedList = []
}
watch(() => state.checkedList, val => {
  state.indeterminate = !!val.length && val.length < props.options.length
  state.checkAll = val.length === props.options.length
  emits('change', val)
})
defineExpose({
  clearCheckedList
})
</script>
<style lang="less">
.checkbox-list {
  display: flex;
  padding-bottom: 10px;

  .check-all {
    align-self: baseline;
    flex: 0 0 70px;

    .ant-checkbox {
      display: inline-block;
    }
  }

  .ant-checkbox-group {
    .ant-checkbox-group-item {
      margin-bottom: 12px;
    }
  }
}
</style>
