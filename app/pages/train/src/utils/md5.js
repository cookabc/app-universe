import BMF from 'browser-md5-file'

export function createFileMd5(rawFile) {
    return new Promise((resolve) => {
        const bmf = new BMF()
        bmf.md5(rawFile, async (err, md5) => {
            resolve(md5)
        }, (progress) => {
        })
    })
}
