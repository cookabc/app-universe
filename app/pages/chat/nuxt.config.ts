// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    typescript: {
        shim: false
    },
    modules: [
        '@ant-design-vue/nuxt',
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt'
    ],
    css: ['@/assets/style/tailwind.css', '@/assets/style/main.less'],
    pinia: {
        autoImports: ['defineStore'],
    },
    vite: {
        css: {
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true,
                },
            },
        },
    },
    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || '/'
        },
    },
})
