<template>
  <a-config-provider class="a-config-provider" wh-full
                     :locale="zhCN">
    <router-view/>
  </a-config-provider>
</template>
<script setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
</script>
