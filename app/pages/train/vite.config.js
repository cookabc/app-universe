import {defineConfig, loadEnv} from 'vite'
import {convertEnv, getRootPath, getSrcPath} from './build/utils'
import {createViteProxy, viteDefine} from './build/config'
import {createVitePlugins} from './build/plugin'


export default defineConfig((configs) => {
    const rootPath = getRootPath()
    const srcPath = getSrcPath()

    const {command, mode} = configs
    const isBuild = command === 'build'
    const env = loadEnv(mode, process.cwd())
    const viteEnv = convertEnv(env)
    const {VITE_PORT, VITE_PUBLIC_PATH, VITE_USE_PROXY, VITE_PROXY_TYPE} = viteEnv

    const plugins = createVitePlugins(viteEnv, isBuild)
    const proxy = createViteProxy(VITE_USE_PROXY, VITE_PROXY_TYPE)

    return {
        base: VITE_PUBLIC_PATH || '/',
        resolve: {
            alias: {
                '~': rootPath,
                '@': srcPath
            }
        },
        define: viteDefine,
        plugins,
        server: {
            host: '0.0.0.0',
            port: VITE_PORT,
            open: false,
            proxy
        },
        build: {
            target: 'es2015',
            outDir: 'dist',
            assetsDir: 'static',
            rollupOptions: {
                output: {
                    compact: true,
                    chunkFileNames: 'static/js/[name]-[hash].js',
                    entryFileNames: 'static/js/[name]-[hash].js',
                    assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
                }
            },
            reportCompressedSize: false, // 启用/禁用 gzip 压缩大小报告
            chunkSizeWarningLimit: 1024 // chunk 大小警告的限制（单位kb）
        }
    }
})
