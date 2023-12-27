import './assets/styles/main.less'
import {model, snake, ui, upload} from './assets/js'

const itemsToCheck = ['背景音', '上', '下', '左', '右']

function onUploaded(result) {
    try {
        model.modelURL = result.model_url
        model.metadataURL = result.metadata_url
        ui.showLoading('模型加载中…')
        model.init(() => {
            ui.hideLoading()
            const classLabels = model.recognizer.wordLabels()
            const result = containsItems(classLabels)
            if (!result) {
                ui.showToast('请注意，您上传的模型文件示例不足，必须包含​（背景音、上、下、左、右）​这五个示例。为了满足您的需求，我们需要您提供这些示例。', 5000)
                upload.fileList = []
                upload.fileNames = []
                upload.renderFileListHtml()
                return
            }
            recognizerListen()
            snake.init()
            document.getElementById('gameArea').style.display = 'block'
            // snake.direction = direction
        })
    } catch (error) {
        ui.hideLoading()
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

function recognizerListen() {
    try {
        const labelContainer = document.getElementById("label-container")
        const classLabels = model.recognizer.wordLabels(); // get class labels
        // listen() takes two arguments:
        // 1. A callback function that is invoked anytime a word is recognized.
        // 2. A configuration object with adjustable fields
        model.recognizer.listen(result => {
            const scores = result.scores; // probability of prediction for each class
            // render the probability scores per class
            const maxScoreIndex = model.findMax(scores)
            const label = classLabels[maxScoreIndex]
            // 上
            if (label === '上') {
                snake.direction = 'top';
            }
            // 右
            else if (label === '右') {
                snake.direction = 'right';
            }
            // 下
            else if (label === '下') {
                snake.direction = 'bottom';
            }
            // 左
            else if (label === '左') {
                snake.direction = 'left';
            }
            labelContainer.innerHTML = '声音：' + label + '，当前方向：' + snake.direction
        }, {
            includeSpectrogram: true, // in case listen should return result.spectrogram
            probabilityThreshold: 0.75,
            invokeCallbackOnNoiseAndUnknown: true,
            overlapFactor: 0.75 // probably want between 0.5 and 0.75. More info in README
        });
    } catch (error) {
        console.log('[ error ]-80', error)
    }
}

snake.init()
document.getElementById('start').addEventListener('click', () => {
    snake.start()
});

document.getElementById('pause').addEventListener('click', () => {
    snake.pause();
});
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
document.addEventListener('keydown', (ev) => {
    if (snake.timer === null) return;

    // 上
    if (ev.key === 'ArrowUp' && snake.direction !== 'bottom') {
        snake.direction = 'top';
    }
    // 右
    else if (ev.key === 'ArrowRight' && snake.direction !== 'left') {
        snake.direction = 'right';
    }
    // 下
    else if (ev.key === 'ArrowDown' && snake.direction !== 'top') {
        snake.direction = 'bottom';
    }
    // 左
    else if (ev.key === 'ArrowLeft' && snake.direction !== 'right') {
        snake.direction = 'left';
    }
});
