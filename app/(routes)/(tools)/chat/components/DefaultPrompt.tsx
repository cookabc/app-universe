import {useState} from "react";
import Image from "next/image";

export default function DefaultPrompt() {
    const [defaultPrompts, setDefaultPrompts] = useState([
        {id: 1, prompt: "What is your name?"},
        {id: 2, prompt: "How are you today?"},
        {id: 3, prompt: "What is your favorite color?"},
    ]);
    const sendPromptMessage = (prompt: {}) => {
        // Send the prompt message to the server
    };

    return (
        <div className="default-prompt message-item w-full mt-9">
            <div
                className="flex p-4 gap-2 text-base md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-5xl md:py-4 lg:px-0 m-auto">
                <div className="flex-shrink-0 flex flex-col relative items-end">
                    <div className="w-14">
                        <Image src="/images/chat/ai_robot.svg" className="w-full h-full object-cover" alt="" width={40}
                               height={40}/>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="greeting px-7 py-4 bg-[var(--ant-primary-color-3)] rounded-xl">
                        <h2 className="greeting-title text-2xl text-[var(--ant-primary-color)] font-semibold mb-4">
                            Hi there, I am you AI assistant!
                        </h2>
                        <p className="text-base text-[#333] mb-0">
                            I can answer your questions, provide information, and assist with your work.
                        </p>
                    </div>
                    <h3 className="font-semibold text-base text-[#333] mt-6 mb-7">
                        Try asking me like this:
                    </h3>
                    <ul className="list-none p-0 m-0">
                        {defaultPrompts.map((prompt) => (
                            <li
                                key={prompt.id}
                                className="bg-white text-base cursor-pointer text-[#333] mb-6 px-5 py-1 rounded-xl"
                                onClick={() => sendPromptMessage(prompt)}
                            >
                                {prompt.prompt}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
