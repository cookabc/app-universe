<template>
  <a-config-provider :theme="{ token: { colorPrimary: '#7260AF' } }">
    <a-layout has-sider class="h-full bg-transparent">
      <a-layout-header class="fixed z-10 w-full p-0 bg-white">
        <AppHeader/>
      </a-layout-header>
      <a-layout-content class="mt-16 flex">
        <a-layout-sider v-if="$route.path.includes('/chat')" class="overflow-y-auto h-full left-0 top-0 bottom-0"
                        width="266">
          <SideBar/>
        </a-layout-sider>
        <NuxtPage/>
      </a-layout-content>
    </a-layout>
  </a-config-provider>
</template>
<script setup>
import AppHeader from '@/components/Header.vue'
import SideBar from '@/components/SideBar.vue'
</script>
