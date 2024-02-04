import Image from "next/image"

const ImageBox = ({url}: { url: string }) => {
    return (<div className="w-1/3 flex-shrink-0 p-1.5 relative">
        <div
            className="w-5 h-5 absolute right-0 top-0 rounded-full cursor-pointer bg-white border border-solid border-black">
            <div
                className="absolute w-[70%] left-[50%] top-[50%] h-0.5 bg-black transform rotate-45 -translate-x-[50%] -translate-y-[50%] pointer-events-none"></div>
            <div
                className="absolute w-[70%] left-[50%] top-[50%] h-0.5 bg-black transform -rotate-45 -translate-x-[50%] -translate-y-[50%] pointer-events-none"></div>
        </div>
        <div className="border border-solid border-gray-300 rounded-[8px] p-1.5 h-28">
            <Image src={url} className="w-full h-full object-cover" alt="" width='100' height='100'/>
        </div>
    </div>);
};

export default ImageBox;
