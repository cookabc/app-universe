const proxyConfigMappings = {
    dev: {
        prefix: '/api',
        target: 'https://arttest.agischool.com.cn'
    },
    // dev: {
    //   prefix: '/models',
    //   target: 'https://agi-assets.oss-cn-beijing.aliyuncs.com'
    // },
    test: {
        prefix: '/api',
        target: 'https://arttest.agischool.com.cn'
    },
    prod: {
        prefix: '/api',
        target: 'https://art.agischool.com.cn'
    }
}

const getProxyConfig = (envType = 'dev') => {
    return proxyConfigMappings[envType]
}

export function createViteProxy(isUseProxy = true, proxyType) {
    if (!isUseProxy) return undefined

    const proxyConfig = getProxyConfig(proxyType)
    return {
        [proxyConfig.prefix]: {
            target: proxyConfig.target,
            changeOrigin: true
            // rewrite: (path) => path.replace(new RegExp(`^${proxyConfig.prefix}`), '')
        }
    }
}
