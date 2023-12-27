import * as faceapi from 'face-api.js'
import {ui} from './js/ui'

async function loadModels() {
    // Load face-api.js models
    await faceapi.nets.faceLandmark68Net.loadFromUri('./models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('./models');
    await faceapi.nets.ssdMobilenetv1.loadFromUri('./models');
}

async function start() {
    try {
        if (faces[0].images.length <= 0) {
            ui.showToast('请您提供一些人物照片，以便我们继续进行操作。', 2500)
            return
        }
        const result = checkLabelName()
        if (result) {
            return ui.showToast(result)
        }
        const video = document.getElementById("video");
        const canvas = document.getElementById("canvas");
        const width = 720;
        const height = 560;
        ui.showLoading('模型加载中...')
        await loadModels()
        ui.hideLoading()
        ui.showLoading('资源加载中...')

        const labeledFaceDescriptors = await loadLabeledImages();
        ui.hideLoading()
        // ui.showLoading('开始检测...')
        // Check if the browser supports getting user media device permissions
        if (navigator.mediaDevices.getUserMedia) {
            // Get video media device permissions
            video.srcObject = await navigator.mediaDevices.getUserMedia({audio: false, video: true});
            // Play the video
            video.play();
            // Event listener for when the video starts playing
            video.addEventListener("play", async () => {
                // Set the display size to the given width and height
                const displaySize = {width, height};
                // Match the canvas display size with the video display size
                faceapi.matchDimensions(canvas, displaySize);

                setInterval(async () => {
                    // Detect all faces in the video and get their landmarks and descriptors
                    const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
                    // Resize the facial detections to the display size
                    const resizedDetections = faceapi.resizeResults(detections, displaySize);
                    // Get the 2D drawing context of the canvas
                    const context = canvas.getContext("2d", {willReadFrequently: true});
                    // Clear the canvas
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    // Draw the facial detections on the canvas
                    faceapi.draw.drawDetections(canvas, resizedDetections);
                    // Create a face matcher object
                    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.7);
                    resizedDetections.forEach(({detection, descriptor}) => {
                        // Find the best match for the face descriptor among the labeled face descriptors
                        const bestMatch = faceMatcher.findBestMatch(descriptor);
                        // Create a draw box for the face detection's box with the best match's label
                        const drawBox = new faceapi.draw.DrawBox(detection.box, {
                            label: bestMatch.toString(),
                        });
                        // Draw the draw box on the canvas
                        drawBox.draw(canvas);
                    });
                    // Set the function to be executed every 100ms
                }, 100);
            });
        }
    } catch (error) {
        console.log('[ error ]-72', error)
    }
}

let tempLabels = ['Label_1']
let currentId = 'Label_1'
const faces = [{
    id: currentId,
    label: currentId,
    images: []
}]

async function change(e) {
    const files = e.target.files
    for (let i = 0; i < files.length; i++) {
        const imgId = currentId + '_img_' + Date.now()
        const result = await createImage(files[i], imgId)
        renderImage(result, imgId)
    }
}

function createImage(file, imgId) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        let labelObj = faces.find(item => item.id === currentId)
        reader.onload = function (e) {
            labelObj.images.push({
                id: imgId,
                src: e.target.result
            })
            console.log('[ faces ]-192', faces)
            resolve(e.target.result)
        };
        reader.readAsDataURL(file)
    })
}

function handleAddClass() {
    const label = {
        id: `Label_${Date.now()}`,
        label: `Label ${tempLabels.length + 1}`,
        images: []
    }
    currentId = label.id
    faces.push(label)
    tempLabels.push(label.label)
    const templateHtml = `
    <div class="relative mb-4 border border-solid border-gray-300 rounded-[8px] p-3" id="${label.id}">
        <div class="w-6 h-6 absolute -right-3 -top-3 rounded-full cursor-pointer bg-white border border-solid border-black JS_removeBtn" onclick="handleRemove(event, '${label.id}')">
          <div class="absolute w-[70%] left-[50%] top-[50%] h-0.5 bg-black transform rotate-45 -translate-x-[50%] -translate-y-[50%] pointer-events-none"></div>
          <div class="absolute w-[70%] left-[50%] top-[50%] h-0.5 bg-black transform -rotate-45 -translate-x-[50%] -translate-y-[50%] pointer-events-none"></div>
        </div>
        <div class="flex items-center mb-4">
            <label class="block text-base font-medium leading-6 text-gray-900 mr-1 w-20 text-end font-semibold">名称：</label>
            <div class="flex-1">
                <input name="label" type="text" class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value='${label.label}' />
            </div>
        </div>
        <div class="border border-solid border-gray-300 rounded-[8px] py-2">
            <div class="pt-2 px-3 text-base font-semibold">上传Label的图片</div>
            <div class="flex flex-wrap p-1.5 imgBox">
                <div class="w-1/3 flex-shrink-0 p-1.5">
                    <label class="border border-dashed border-gray-900/25 rounded-[8px] p-1.5 flex flex-col items-center justify-center block text-center cursor-pointer h-28">
                        <svg class="text-gray-300 mx-auto" viewBox="0 0 1024 1024" width="30" height="30">
                            <path d="M153.6 902.656a32.256 32.256 0 0 1 0-64h716.8a32.256 32.256 0 0 1 0 64z m390.656-665.6v494.592a32.256 32.256 0 0 1-64 0V237.056L236.032 481.28a31.744 31.744 0 1 1-45.056-45.056l294.912-295.424a36.864 36.864 0 0 1 51.2 0l294.912 294.912a31.744 31.744 0 0 1-45.056 45.056z" fill="currentColor"></path>
                        </svg>
                        <div class="mt-2 text-sm leading-6 font-semibold text-[#7260af] hover:text-[#8e82bd]">点击上传图片</div>
                        <input id="uploadImage" accept="image/*" multiple name="uploadImage" onchange="handleInputChange(event, '${label.id}')" type="file" class="sr-only">
                    </label>
                </div>
            </div>
        </div>
    </div>`
    document.querySelector('#labelList').innerHTML += templateHtml
    controlRemoveVisible()
    console.log('[ faces ]-192', faces)
}

function loadLabeledImages() {
    return Promise.all(
        faces.map(async (face) => {
            const descriptions = [];
            for (let i = 0; i < face.images.length; i++) {
                const currentImage = face.images[i]
                const img = document.createElement('img');
                img.onload = async () => {
                    const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
                    if (!detections) {
                        console.log(`No face detected in ${face.label + ": " + face.images[i]}`);
                        return
                    }
                    descriptions.push(detections.descriptor);
                }
                img.src = currentImage.src
            }
            return new faceapi.LabeledFaceDescriptors(face.label, descriptions);
        })
    );
}

function controlRemoveVisible() {
    const removeButtons = document.querySelectorAll('#labelList .JS_removeBtn')
    if (removeButtons.length <= 1) {
        removeButtons[0].style.display = 'none'
    } else {
        removeButtons.forEach(button => {
            button.style.display = ''
        });
    }
}

function renderImage(result, imgId) {
    const imgHtml = `<div class="w-1/3 flex-shrink-0 p-1.5 relative" id="${imgId}">
    <div class="w-5 h-5 absolute right-0 top-0 rounded-full cursor-pointer bg-white border border-solid border-black JS_removeBtn" data-pid='${currentId}' data-id='${imgId}'>
      <div class="absolute w-[70%] left-[50%] top-[50%] h-0.5 bg-black transform rotate-45 -translate-x-[50%] -translate-y-[50%] pointer-events-none">
      </div>
      <div class="absolute w-[70%] left-[50%] top-[50%] h-0.5 bg-black transform -rotate-45 -translate-x-[50%] -translate-y-[50%] pointer-events-none">
      </div>
    </div>
    <div class="border border-solid border-gray-300 rounded-[8px] p-1.5 h-28">
      <img src="${result}" class="w-full h-full object-cover" alt="" />
    </div>
  </div>`
    const imgBox = document.querySelectorAll(`#${currentId} .imgBox`)
    imgBox[0].insertAdjacentHTML('afterbegin', imgHtml)
}

function handleRemoveImage(e, parendId, id) {
    const currentFace = faces.find(face => face.id === parendId)
    const imgIndex = currentFace.images.findIndex(item => item.id === id)
    currentFace.images.splice(imgIndex, 1)
    e.target.parentElement.remove()
}

async function handleRemove(e, id) {
    const index = faces.findIndex(face => face.id === id)
    faces.splice(index, 1)
    await e.target.parentElement.remove()
    controlRemoveVisible()
}

function checkSameName(value) {
    return faces.some((item) => item.label === value)
}

function checkLabelName() {
    let msg = ''
    for (let i = 0; i < faces.length; i++) {
        if (!faces[i].label) {
            msg = '请输入示例名称'
            break
        }
    }
    return msg
}

controlRemoveVisible()
document.getElementById('uploadImage').addEventListener('change', async (e) => {
    const result = await change(e)
    e.target.value = ''
    if (result) {
        renderImage()
    }
})
document.querySelector('#labelList').addEventListener('click', (e) => {
    if (e.target.classList.contains('JS_removeBtn')) {
        const parentId = e.target.dataset.pid
        const imgId = e.target.dataset.id
        handleRemoveImage(e, parentId, imgId)
    }
})
document.querySelector('.labelName').addEventListener('blur', (e) => {
    const value = e.target.value
    faces[0].label = value
    if (!value) {
        ui.showToast('示例名称不能为空', 1500)
    }
})
document.getElementById('startBtn').addEventListener('click', start)
