'use client';

import {CopyOutlined, LoadingOutlined} from "@ant-design/icons";
import {useState} from "react";
import Image from "next/image";
import "@/app/styles/chat.css";
import DefaultPrompt from "./components/DefaultPrompt";
import TextComponent from "./components/Text";

export default function Page() {
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);

    const onCopy = (text: string) => {
        // Handle copy functionality here
    };

    return (<div className="relative flex h-full max-w-full flex-1 overflow-hidden">
        <div className="chat-right overflow-y-auto bg-[var(--chat-bg-color)] w-full h-full scroll-smooth">
            <div className="message-list py-4" id="scrollRef">
                {loading && (
                    <div className="absolute w-full h-full flex justify-center items-center text-3xl">
                        <LoadingOutlined/>
                    </div>
                )}
                {!loading && messages.length > 0 && messages.map((message: any) => {
                    return (<div key={message.id}>
                        <div className="group message-item w-full">
                            <div
                                className="flex p-4 gap-2 text-base md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-5xl md:py-4 lg:px-0 m-auto">
                                <div className="flex-shrink-0 flex flex-col relative items-end">
                                    <div className="w-10">
                                        <Image src="/images/chat/people.jpg" className="w-full h-full object-cover"
                                               alt="" width={40} height={40}/>
                                    </div>
                                </div>
                                <div
                                    className="message-content relative bg-[var(--ant-primary-color-3)] flex flex-col gap-1 md:gap-3 p-4 lg:w-[calc(100%-115px)] rounded-xl">
                                    <TextComponent text={message.prompt}/>
                                    <div className="flex">
                                        <button type="button" className="ml-auto"
                                                onClick={() => onCopy(message.prompt)}>
                                            <CopyOutlined/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="group message-item w-full">
                            <div
                                className="flex p-4 gap-2 text-base md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-5xl md:py-4 lg:px-0 m-auto">
                                <div className="flex-shrink-0 flex flex-col relative items-end">
                                    <div className="w-10">
                                        <Image src="/images/chat/ai_robot.svg" className="w-full h-full object-cover"
                                               alt="" width={40} height={40}/>
                                    </div>
                                </div>
                                <div
                                    className="message-content relative flex w-[calc(100%-50px)] flex-col lg:w-[calc(100%-115px)] bg-white p-4 rounded-xl">
                                    <TextComponent text={message.response}/>
                                    <div className="flex">
                                        <button type="button" className="ml-auto" title="复制"
                                                onClick={() => onCopy(message.response)}>
                                            <CopyOutlined/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>)
                })}
                {!loading && messages.length === 0 && <DefaultPrompt/>}
                <div className="h-32 md:h-48 flex-shrink-0"></div>
            </div>
        </div>
    </div>)
}
