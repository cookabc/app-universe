<template>
  <div w-1024 mx-auto py-100>
    <h1 text-48 font-900 mb-30>New Project</h1>
    <div flex flex-wrap mx--10>
      <div v-for="(item, index) in list" :key="index" class="w-1/3" box-border h-300 p-10>
        <router-link :to="item.path" block wh-full bg-white p-20 shadow-2xl rounded-20 cursor-pointer>
          <h2>{{ item.name }}</h2>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref} from "vue";

const list = ref([
  {
    name: 'Image Project',
    path: '/train/image'
  }
])
</script>
