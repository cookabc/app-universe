<template>
  <div class="relative flex h-full max-w-full flex-1 overflow-hidden">
    <div id="chatContent"
         class="chat-right overflow-y-auto bg-[var(--chat-bg-color)] w-full h-full scroll-smooth">
      <chat-component/>
      <input-component/>
    </div>
  </div>
</template>
<script setup>
import ChatComponent from '@/components/ChatComponent.vue'
import InputComponent from '@/components/InputComponent.vue'
</script>
