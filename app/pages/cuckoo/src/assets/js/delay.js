export default function delay(ms) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            resolve(timer)
        }, ms)
    })
}
