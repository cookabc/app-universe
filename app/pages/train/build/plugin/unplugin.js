import {resolve} from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {AntDesignVueResolver} from 'unplugin-vue-components/resolvers'
import {FileSystemIconLoader} from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'

import {getSrcPath} from '../utils'

const customIconPath = resolve(getSrcPath(), 'assets/svg')
export default [
    AutoImport({
        imports: ['vue', 'vue-router'],
        dirs: ['./src/api', './src/settings', '@/utils', './src/store'], // 自动导入自定义模块
        dts: false
    }),
    Icons({
        compiler: 'vue3',
        customCollections: {
            custom: FileSystemIconLoader(customIconPath)
        },
        scale: 1,
        defaultClass: 'inline-block'
    }),
    Components({
        resolvers: [
            AntDesignVueResolver({
                importStyle: false, // css in js
            }),
            IconsResolver({
                customCollections: ['custom'],
                componentPrefix: 'icon'
            })
        ],
        dts: false
    }),
    createSvgIconsPlugin({
        iconDirs: [customIconPath],
        symbolId: 'icon-custom-[dir]-[name]',
        inject: 'body-last',
        customDomId: '__CUSTOM_SVG_ICON__'
    })
]
