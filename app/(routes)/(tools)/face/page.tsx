'use client';

import React from 'react';
import MoteCamMessage from "@/app/components/face/MoteCamMessage";
import LoadingBox from "@/app/components/face/LoadingBox";
import ToastBox from "@/app/components/face/ToastBox";
import useMOTECam from "@/app/hooks/face/useMoteCam";


export default function Page() {
    const [toast, setToast] = React.useState({
        open: false,
        text: '',
    });
    const [loading, setLoading] = React.useState({
        open: false,
        text: '',
    });

    const moteCam = useMOTECam();

    return (<>
        <LoadingBox open={loading.open} text={loading.text}/>
        <ToastBox open={toast.open} text={toast.text}/>
        <div className="flex flex-wrap p-5 md:p-10 mt-[64px]">
            <div className="upload-box w-full md:w-[440px]">
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
