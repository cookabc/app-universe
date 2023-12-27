import {compressImage, ui, upload} from "./scripts"
import GameCoordinator from './scripts/core/gameCoordinator'
import {loadFromFiles, Webcam} from '@teachablemachine/image/dist'

let gameCoordinator
const itemsToCheck = ['上', '下', '左', '右']
let webcam
let model

async function loop() {
    webcam.update(); // update the webcam frame
    window.requestAnimationFrame(loop);
}

async function setupWebcam() {
    webcam = new Webcam(224, 224, true); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);
    // append elements to the DOM
    document.querySelector('#webcam').appendChild(webcam.canvas)
}

async function getImage() {
    return new Promise(async (resolve, reject) => {
        const imgData = webcam.canvas.toDataURL('image/jpeg')
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.crossOrigin = "anonymous";
        img.src = await compressImage(imgData, 224, 224)
    });
}

let isPredicting = false

async function predict() {
    const labelContainer = document.getElementById("label-container")
    while (isPredicting) {
        const img = await getImage()
        const predictions = await model.predict(img)
        const result = findMax(predictions)
        const label = result.className
        labelContainer.innerText = "方向：" + label
        if (label === "上") {
            changeDirection('up')
        } else if (label === "下") {
            changeDirection('down')
        } else if (label === "左") {
            changeDirection('left')
        } else if (label === "右") {
            changeDirection('right')
        }
    }
}

const handleUpload = async () => {
    try {
        const fileList = upload.fileList
        const modelFile = fileList.find(file => file.name === 'model.json')
        const weights = fileList.find(file => file.name === 'weights.bin')
        const metadata = fileList.find(file => file.name === 'metadata.json')
        model = await loadFromFiles(modelFile, weights, metadata)
        const labels = model.getClassLabels()
        const result = containsItems(labels)
        if (!result) {
            ui.showToast(upload.messages['uploadPrompt'], 5000)
            upload.fileList = []
            upload.fileNames = []
            upload.renderFileListHtml()
            return
        }
        await initGame()
    } catch (error) {
        console.log('[ error ]-159', error)
        ui.showToast(error.toString() + '，请重新上传。')
    }
}

function containsItems(data) {
    for (const item of itemsToCheck) {
        if (data.includes(item)) {
            return true; // 如果包含任何一个项，返回true
        }
    }
    return false; // 如果都不包含，返回false
}

function findMax(data) {
    return data.reduce((max, current) => {
        return current.probability > max.probability ? current : max;
    }, data[0])
}

/**
 * Calls Pacman changeDirection event if certain conditions are met
 * @param {({'up'|'down'|'left'|'right'})} direction
 */
function changeDirection(direction) {
    gameCoordinator.changeDirection(direction)
}

async function initGame() {
    gameCoordinator = new GameCoordinator()
    await setupWebcam()
    gameCoordinator?.gameStartButton.addEventListener("click", async () => {
        isPredicting = true
        await predict()
    })
    gameCoordinator?.pauseButton.addEventListener("click", () => {
        isPredicting = !isPredicting
        predict()
    })
}

document.getElementById('uploadModel').addEventListener('change', (e) => {
    upload.change(e, handleUpload).then(() => document.querySelector('#dragUpload').classList.add('hidden'))
})
document.getElementById('dragUpload').addEventListener('dragover', (e) => {
    e.preventDefault()
    document.querySelector('#dragUpload').classList.add('hidden')
})
document.getElementById('dragUpload').addEventListener('drop', (e) => {
    e.preventDefault()
    upload.change(e, handleUpload).then(() => document.querySelector('#dragUpload').classList.add('hidden'))
})
