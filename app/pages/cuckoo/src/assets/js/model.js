import * as speechCommands from '@tensorflow-models/speech-commands'

export const model = {
    // URL: "https://community.agischool.com.cn/models/snake/",
    modelURL: '',
    metadataURL: '',
    recognizer: '',
    async createModel() {
        const recognizer = speechCommands.create(
            "BROWSER_FFT", // fourier transform type, not useful to change
            undefined, // speech commands vocabulary feature, not useful for your models
            this.modelURL,
            this.metadataURL
        );

        // check that model and metadata are loaded via HTTPS requests.
        await recognizer.ensureModelLoaded();

        return recognizer;
    },
    async init(cb) {
        this.recognizer = await this.createModel();
        if (this.recognizer) {
            typeof cb === 'function' && cb()
        }
    },
    findMax(array) {
        let maxIndex = 0;
        let maxValue = array[0];
        for (let i = 1; i < array.length; i++) {
            if (array[i] > maxValue) {
                maxIndex = i;
                maxValue = array[i];
            }
        }
        return maxIndex
    }
}
