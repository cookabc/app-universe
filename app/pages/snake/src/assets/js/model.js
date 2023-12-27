import * as speechCommands from '@tensorflow-models/speech-commands'

export const model = {
    // URL: "https://community.agischool.com.cn/models/snake/",
    modelURL: '',
    metadataURL: '',
    recognizer: '',
    async createModel() {
        // const checkpointURL = this.URL + "model.json"; // model topology
        // const metadataURL = this.URL + "metadata.json"; // model metadata

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
        // const labelContainer = document.getElementById("label-container")
        // const classLabels = this.recognizer.wordLabels(); // get class labels
        // for (let i = 0; i < classLabels.length; i++) {
        //   labelContainer.appendChild(document.createElement("div"))
        // }
        // let direction = ''
        // // listen() takes two arguments:
        // // 1. A callback function that is invoked anytime a word is recognized.
        // // 2. A configuration object with adjustable fields
        // recognizer.listen(result => {
        //   const scores = result.scores; // probability of prediction for each class
        //   // render the probability scores per class
        //   const maxScoreIndex = this.findMax(scores)
        //   const label = classLabels[maxScoreIndex]
        //   // 上
        //   if (label === '上') {
        //     direction = 'top';
        //   }
        //   // 右
        //   else if (label === '右') {
        //     direction = 'right';
        //   }
        //   // 下
        //   else if (label === '下') {
        //     direction = 'bottom';
        //   }
        //   // 左
        //   else if (label === '左') {
        //     direction = 'left';
        //   }
        //   labelContainer.innerHTML = '声音：' + label + '，当前方向：' + direction
        // }, {
        //   includeSpectrogram: true, // in case listen should return result.spectrogram
        //   probabilityThreshold: 0.75,
        //   invokeCallbackOnNoiseAndUnknown: true,
        //   overlapFactor: 0.75 // probably want between 0.5 and 0.75. More info in README
        // });
        if (this.recognizer) {
            typeof cb === 'function' && cb()
        }
        // Stop the recognition in 5 seconds.
        // setTimeout(() => recognizer.stopListening(), 5000);
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
