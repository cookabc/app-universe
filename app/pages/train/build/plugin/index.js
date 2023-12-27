import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import viteCompression from 'vite-plugin-compression'
import VueDevTools from 'vite-plugin-vue-devtools'
import {configHtmlPlugin} from './html'
import unplugin from './unplugin'

export function createVitePlugins(viteEnv, isBuild) {
    const plugins = [
        vue(),
        VueDevTools(),
        ...unplugin,
        configHtmlPlugin(viteEnv, isBuild),
        Unocss()
    ]
    if (viteEnv?.VITE_USE_COMPRESS) {
        plugins.push(viteCompression({algorithm: viteEnv.VITE_COMPRESS_TYPE || 'gzip'}))
    }

    return plugins
}
