<template>
  <nav class="nav flex items-center text-base flex-1">
    <router-link
        class="nav-link h-[var(--nav-height)] leading-[var(--nav-height)] text-[var(--font-color-333)] px-6 transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis font-medium hover:text-[var(--ant-primary-color)] hover:bg-[var(--ant-primary-color-3)]"
        to="/" :class="$route.path === '/' ? 'text-[var(--ant-primary-color)] bg-[var(--ant-primary-color-3)]' : ''">
      PROMPTS
    </router-link>
    <router-link
        class="nav-link h-[var(--nav-height)] leading-[var(--nav-height)] text-[var(--font-color-333)] px-6 transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis font-medium hover:text-[var(--ant-primary-color)] hover:bg-[var(--ant-primary-color-3)]"
        to="/chat"
        :class="$route.path.includes('/chat') ? 'text-[var(--ant-primary-color)] bg-[var(--ant-primary-color-3)]' : ''">
      CHAT
    </router-link>
  </nav>
</template>
