<template>
  <div class="min-h-[calc(100vh-50px)]">
    <div flex flex-wrap lg="px-200 py-40" md="p-40" p-4>
      <div v-for="(item, index) in list" :key="index" class="w-full sm:w-1/2 md:w-1/3" p-30>
        <router-link :to="item.path" block z-0 p-20 pr-40 box-border flex rounded-20 bg-purple bg-opacity-30>
          <the-icon :icon="item.icon" :size="30"/>
          <div ml-10>
            <h2 text-20 mb-14>{{ item.name }}</h2>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref} from "vue";

const list = ref([
  {
    name: 'AI如何看见',
    path: '/train/image',
    color: '',
    icon: 'raphael:picture'
  }
])
</script>
