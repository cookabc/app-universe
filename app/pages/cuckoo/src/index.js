import "./assets/styles/main.less"
import {delay, model, ui, upload} from "./assets/js"

const itemsToCheck = ['背景音', '布谷鸟', '老虎', '百灵鸟', '枪']
const messages = {
    lack: '请注意，您上传的模型文件示例不足，必须包含​（背景音、布谷鸟、老虎、百灵鸟、枪）​这五个示例。为了满足您的需求，我们需要您提供这些示例。'
}

function onUploaded(result) {
    console.log('[ result ]-5', result)
    model.modelURL = result.model_url
    model.metadataURL = result.metadata_url
    ui.showLoading('模型加载中…')
    model.init(() => {
        ui.hideLoading()
        const classLabels = model.recognizer.wordLabels()
        const result = containsItems(classLabels)
        if (!result) {
            ui.showToast(messages.lack, 5000)
            upload.fileList = []
            upload.fileNames = []
            upload.renderFileListHtml()
            return
        }
        recognizerListen()
        document.getElementById('gameArea').style.display = 'block'
        // snake.direction = direction
    })
}

function containsItems(data) {
    for (const item of itemsToCheck) {
        if (data.includes(item)) {
            return true; // 如果包含任何一个项，返回true
        }
    }
    return false; // 如果都不包含，返回false
}

let timer = null

function recognizerListen() {
    const labelContainer = document.getElementById("label-container")
    const classLabels = model.recognizer.wordLabels(); // get class labels
    model.recognizer.listen(async result => {
        const scores = result.scores; // probability of prediction for each class
        const maxScoreIndex = model.findMax(scores)
        const label = classLabels[maxScoreIndex]
        labelContainer.innerHTML = "声音：" + label;
        if (label === "布谷鸟") {
            document.querySelector("#cuckoo").classList.add("show");
            document.querySelector("#cuckooBubble").classList.add("show");
            document.querySelector("#cuckooBubble").innerHTML = "我是布谷鸟，我听到了有人在叫我。";
            timer = await delay(3000)
            document.querySelector("#cuckooBubble").classList.remove("show");
            document.querySelector("#peopleBubble").classList.add("show");
            document.querySelector("#peopleBubble").innerHTML = "我发现了布谷鸟，跟我回家吧！";
            timer = await delay(3000);
            document.querySelector("#cuckoo").classList.remove("show");
            document.querySelector("#peopleBubble").classList.remove("show");
        }
        // 老虎
        else if (label === "老虎") {
            document.querySelector("#tiger").classList.add("show");
            document.querySelector("#tigerBubble").classList.add("show");
            document.querySelector("#tigerBubble").innerHTML = "我听到了同类的叫声，它在哪？";
            timer = await delay(3000);
            document.querySelector("#tigerBubble").classList.remove("show");
            document.querySelector("#peopleBubble").classList.add("show");
            document.querySelector("#peopleBubble").innerHTML = "附近有老虎的叫声，我得小心些。";
            timer = await delay(3000);
            document.querySelector("#peopleBubble").classList.remove("show");
            document.querySelector("#tiger").classList.remove("show");
        }
        // 百灵鸟
        else if (label === "百灵鸟") {
            document.querySelector("#lark").classList.add("show");
            document.querySelector("#larkBubble").classList.add("show");
            document.querySelector("#larkBubble").innerHTML = "我不是布谷鸟，我是爱唱歌的百灵鸟。";
            timer = await delay(3000);
            document.querySelector("#larkBubble").classList.remove("show");
            document.querySelector("#peopleBubble").classList.add("show");
            document.querySelector("#peopleBubble").innerHTML = "这个不是布谷鸟。";
            timer = await delay(3000);
            document.querySelector("#lark").classList.remove("show");
            document.querySelector("#peopleBubble").classList.remove("show");
        }
        // 枪
        else if (label === "枪") {
            document.querySelector("#hunter").classList.add("show");
            document.querySelector("#hunterBubble").classList.add("show");
            document.querySelector("#hunterBubble").innerHTML = "哈哈哈！！！我要抓住这只老虎。";
            timer = await delay(3000);
            document.querySelector("#hunterBubble").classList.remove("show");
            document.querySelector("#peopleBubble").classList.add("show");
            document.querySelector("#peopleBubble").innerHTML = "有偷猎者，我要赶紧联系警察抓住坏蛋！";
            timer = await delay(3000);
            document.querySelector("#hunter").classList.remove("show");
            document.querySelector("#peopleBubble").classList.remove("show");
        }
    }, {
        includeSpectrogram: true, // in case listen should return result.spectrogram
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.75 // probably want between 0.5 and 0.75. More info in README
    });
}

document.getElementById('uploadModel').addEventListener('change', (e) => {
    upload.change(e)
})
document.getElementById('uploadSubmit').addEventListener('click', async () => {
    const result = await upload.submit(files)
    onUploaded(result)
})
document.getElementById('dragUpload').addEventListener('dragover', (e) => {
    e.preventDefault()
})
document.getElementById('dragUpload').addEventListener('drop', (e) => {
    e.preventDefault()
    upload.change(e)
})
