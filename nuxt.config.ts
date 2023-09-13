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
    nitro: {
        runtimeConfig: {
            // baseURL: 'https://chattest.agischool.com.cn',
            baseURL: 'http://127.0.0.1:5001',
        }
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
})
