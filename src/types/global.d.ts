export {}

interface _FundGzData {
    fundcode: string
    name: string
    dwjz: string
    gsz: string
    gztime: string
    jzrq: string
    gszzl: string | number
}

declare global {
    interface Window {
        v_sh000001?: string
        v_s_sh000001?: string
        v_s_sz399001?: string
        v_s_sz399006?: string
        [key: string]: unknown
    }
}
