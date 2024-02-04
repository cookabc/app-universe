const LoadingBox = ({open, text}: { open: boolean, text: string }) => {
    return (open
        ? <div className="loading fixed inset-0 z-10 flex justify-center items-center bg-black/25">
            <div
                className="loading-inner flex justify-center items-center mt-10% p-6 text-white text-xl bg-black/80 rounded-lg gap-x-3 max-w-[500px]">
                <div className="custom-loading animate-spin loading-icon w-8 h-8"></div>
                <div>{text}</div>
            </div>
        </div>
        : <></>);
};

export default LoadingBox;
