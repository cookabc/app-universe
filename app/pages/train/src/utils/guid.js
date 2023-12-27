export function guid() {
    const cryptoStor = new Uint8Array(32);
    const randomNums = window.crypto.getRandomValues(cryptoStor);
    let id = '';
    for (let i = 0; i < randomNums.byteLength; i++) {
        id += Math.round(randomNums[i] / 16).toString(16);
    }
    return id;
}
