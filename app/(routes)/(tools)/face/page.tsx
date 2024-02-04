'use client';

import React from 'react';
import {MoteCamMessage} from "@/app/components/face/MoteCamMessage";
import {useMOTECam} from "@/app/hooks/face/useMoteCam";
import LoadingBox from "@/app/components/face/LoadingBox";
import ToastBox from "@/app/components/face/ToastBox";


export default function Page() {
    // let currentId = 'Name'
    // const face = {
    //     id: currentId,
    //     label: currentId,
    //     images: []
    // };
    // const [label, setLabel] = useState(face.label);
    const [toast, setToast] = React.useState({
        open: false,
        text: '',
    });
    const [loading, setLoading] = React.useState({
        open: false,
        text: '',
    });
    // const [imageList, setImageList] = useState([] as any[]);

    // const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const files = e.target.files as FileList
    //     for (let i = 0; i < files.length; i++) {
    //         const imageId = currentId + '_img_' + Date.now()
    //         const reader = new FileReader()
    //         reader.onload = (e) => {
    //             setImageList([...imageList, {
    //                 id: files[i].name + imageId,
    //                 url: e.target?.result
    //             }]);
    //         };
    //         reader.readAsDataURL(files[i])
    //     }
    // }
    //
    // const blurLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = e.target?.value
    //     setLabel(value);
    //     console.log(value)
    //     face.label = value
    //     console.log(!value)
    //     if (!value) {
    //         setToast({
    //             open: true,
    //             text: '示例名称不能为空',
    //         });
    //         setTimeout(() => {
    //             setToast({
    //                 open: false,
    //                 text: '',
    //             });
    //         }, 1000);
    //     }
    // }
    //
    // const checkLabelName = () => {
    //     let msg = ''
    //     if (!face.label) {
    //         msg = '请输入示例名称'
    //     }
    //     return msg
    // }
    //
    // const loadLabeledImages = () => {
    //     const descriptions: Float32Array[] = [];
    //     for (let i = 0; i < face.images.length; i++) {
    //         const currentImage = face.images[i] as HTMLImageElement
    //         const img = document.createElement('img');
    //         img.onload = async () => {
    //             const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    //             if (!detections) {
    //                 console.log(`No face detected in ${face.label + ": " + face.images[i]}`);
    //                 return
    //             }
    //             descriptions.push(detections.descriptor);
    //         }
    //         img.src = currentImage.src
    //     }
    //     return Promise.resolve(new faceapi.LabeledFaceDescriptors(face.label, descriptions));
    // }

    // const start = async () => {
    //     try {
    //         if (imageList.length === 0) {
    //             setToast({
    //                 open: true,
    //                 text: '请提供一些人物照片，以便我们继续进行操作。',
    //             });
    //             setTimeout(() => {
    //                 setToast({
    //                     open: false,
    //                     text: '',
    //                 });
    //             }, 2000);
    //             return;
    //         }
    //         const result = checkLabelName()
    //         if (result) {
    //             setToast({
    //                 open: true,
    //                 text: result,
    //             });
    //             setTimeout(() => {
    //                 setToast({
    //                     open: false,
    //                     text: '',
    //                 });
    //             }, 2000);
    //             return;
    //         }
    //         const video = document.getElementById("video") as HTMLVideoElement;
    //         const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    //         const width = 720;
    //         const height = 560;
    //         setLoading({
    //             open: true,
    //             text: '资源加载中...'
    //         })
    //         await loadModels();
    //         const labeledFaceDescriptors = await loadLabeledImages();
    //         setLoading({
    //             open: false,
    //             text: ''
    //         })
    //         // Check if the browser supports getting user media device permissions
    //         if (navigator.mediaDevices.getUserMedia) {
    //             // Get video media device permissions
    //             video.srcObject = await navigator.mediaDevices.getUserMedia({audio: false, video: true});
    //             // Play the video
    //             await video.play();
    //             // Event listener for when the video starts playing
    //             video.addEventListener("play", async () => {
    //                 // Set the display size to the given width and height
    //                 const displaySize = {width, height};
    //                 // Match the canvas display size with the video display size
    //                 faceapi.matchDimensions(canvas, displaySize);
    //
    //                 setInterval(async () => {
    //                     // Detect all faces in the video and get their landmarks and descriptors
    //                     const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
    //                     // Resize the facial detections to the display size
    //                     const resizedDetections = faceapi.resizeResults(detections, displaySize);
    //                     // Get the 2D drawing context of the canvas
    //                     const context = canvas.getContext("2d", {willReadFrequently: true}) as CanvasRenderingContext2D;
    //                     // Clear the canvas
    //                     context.clearRect(0, 0, canvas.width, canvas.height);
    //                     // Draw the facial detections on the canvas
    //                     faceapi.draw.drawDetections(canvas, resizedDetections);
    //                     // Create a face matcher object
    //                     const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.7);
    //                     resizedDetections.forEach(({detection, descriptor}) => {
    //                         // Find the best match for the face descriptor among the labeled face descriptors
    //                         const bestMatch = faceMatcher.findBestMatch(descriptor);
    //                         // Create a draw box for the face detection's box with the best match's label
    //                         const drawBox = new faceapi.draw.DrawBox(detection.box, {
    //                             label: bestMatch.toString(),
    //                         });
    //                         // Draw the draw box on the canvas
    //                         drawBox.draw(canvas);
    //                     });
    //                     // Set the function to be executed every 100ms
    //                 }, 100);
    //             });
    //         }
    //     } catch (error) {
    //         console.log('[ error ]-72', error)
    //     }
    // }

    const moteCam = useMOTECam();

    return (<>
        <LoadingBox open={loading.open} text={loading.text}/>
        <ToastBox open={toast.open} text={toast.text}/>
        <div className="flex flex-wrap p-5 md:p-10 mt-[64px]">
            <div className="upload-box w-full md:w-[440px]">
                {/*<div role="alert"*/}
                {/*     className="alert alert-info mb-4 box-border m-0 py-[8px] px-[12px] text-[rgba(0,0,0,.88)] text-[14px] leading-5 list-none relative break-words rounded-[8px] bg-[#f0e8f7] border border-solid border-[#8e82bd]"*/}
                {/*     data-show="true">*/}
                {/*    <div className="alert-content min-w-0">*/}
                {/*        <div className="text-sm leading-5 text-gray-600 font-bold">请您提供一些人物照片，以便我们继续进行操作。*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<div id="labelList">*/}
                {/*    <div className="relative mb-4 border border-solid border-gray-300 rounded-[8px] p-3" id="Name">*/}
                {/*        /!*<div onClick={(e) => clickLabels(e)}*!/*/}
                {/*        /!*    className="w-6 h-6 absolute -right-3 -top-3 rounded-full cursor-pointer bg-white border border-solid border-black JS_removeBtn"*!/*/}
                {/*        /!*>*!/*/}
                {/*        /!*    <div*!/*/}
                {/*        /!*        className="absolute w-[70%] left-[50%] top-[50%] h-0.5 bg-black transform rotate-45 -translate-x-[50%] -translate-y-[50%] pointer-events-none">*!/*/}
                {/*        /!*    </div>*!/*/}
                {/*        /!*    <div*!/*/}
                {/*        /!*        className="absolute w-[70%] left-[50%] top-[50%] h-0.5 bg-black transform -rotate-45 -translate-x-[50%] -translate-y-[50%] pointer-events-none">*!/*/}
                {/*        /!*    </div>*!/*/}
                {/*        /!*</div>*!/*/}
                {/*        <div className="flex items-center">*/}
                {/*            <label*/}
                {/*                className="block text-base leading-6 text-gray-900 mr-1 w-20 text-end font-semibold">示例名称：</label>*/}
                {/*            <div className="flex-1">*/}
                {/*                <input name="label" type="text"*/}
                {/*                       className="block box-border w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 labelName"*/}
                {/*                       value={label}*/}
                {/*                       onChange={(e) => blurLabel(e)}*/}
                {/*                    // onBlur={blurLabel}*/}
                {/*                />*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*        <div className="pt-2 text-base font-semibold">上传示例图片</div>*/}
                {/*        <div className="flex flex-wrap -mx-1.5 imgBox">*/}
                {/*            {imageList.map(image => <ImageBox key={image.id} url={image.url}/>)}*/}
                {/*            <div className="w-1/3 flex-shrink-0 p-1.5">*/}
                {/*                <label*/}
                {/*                    className="border border-dashed border-gray-900/25 rounded-[8px] p-1.5 flex flex-col items-center justify-center text-center cursor-pointer h-28">*/}
                {/*                    <svg className="text-gray-300 mx-auto" viewBox="0 0 1024 1024" width="40"*/}
                {/*                         height="40">*/}
                {/*                        <path*/}
                {/*                            d="M153.6 902.656a32.256 32.256 0 0 1 0-64h716.8a32.256 32.256 0 0 1 0 64z m390.656-665.6v494.592a32.256 32.256 0 0 1-64 0V237.056L236.032 481.28a31.744 31.744 0 1 1-45.056-45.056l294.912-295.424a36.864 36.864 0 0 1 51.2 0l294.912 294.912a31.744 31.744 0 0 1-45.056 45.056z"*/}
                {/*                            fill="currentColor"></path>*/}
                {/*                    </svg>*/}
                {/*                    <div*/}
                {/*                        className="mt-2 text-sm leading-6 font-semibold text-[#7260af] hover:text-[#8e82bd]">*/}
                {/*                        点击上传图片*/}
                {/*                    </div>*/}
                {/*                    <input id="uploadImage" multiple name="uploadImage" accept="image/*" type="file"*/}
                {/*                           className="sr-only" onChange={async (e) => uploadImage(e)}/>*/}
                {/*                </label>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="flex py-2">
                    <button type="button" id="startBtn" onClick={moteCam.startAndStop}
                            className="disabled w-full md:w-[100px] cursor-pointer pointer-events-auto rounded-md bg-[#7260af] px-3 py-2 text-base font-semibold leading-5 text-white ml-auto border-0">
                        {moteCam.isStarted ? "结束识别" : "开始识别"}
                    </button>
                </div>
                {moteCam.isStarted && <MoteCamMessage {...moteCam.moteCamAdvice} />}
            </div>
            <div className="p-0 md:px-10 flex-shrink-0 w-full md:w-auto">
                <div
                    className="video-container relative w-full h-[400px] md:w-[720px] md:h-[560px] border-2 border-solid border-[#7260af]">
                    <video id="video" ref={moteCam.videoRef} className="w-full h-full" autoPlay playsInline muted/>
                    <canvas id="canvas" ref={moteCam.canvasRef} className="w-full h-full absolute top-0 left-0"/>
                </div>
            </div>
        </div>
    </>);
};
