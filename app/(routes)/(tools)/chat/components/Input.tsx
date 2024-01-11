'use client';

import React, {useRef, useState} from 'react';
import {Button, TextareaAutosize} from '@mui/material';
import {useSearchParams} from "next/navigation";

const InputComponent: React.FC = () => {
    const searchParams = useSearchParams();
    const messageRef = useRef<any>();
    const [chatValue, setChatValue] = useState<string>('');
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    const sessionId = searchParams.get("sessionId");

    const onSendMsg = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            await sendMessage();
        }
    };

    const sendMessage = async () => {
        if (isDisabled) return;
        try {
            let text = chatValue;
            if (text === '' || /^\s+$/.test(text)) {
                // message.warn('Input your question');
                return;
            }
            setIsDisabled(true);
            const payload = {
                sessionId: sessionId,
                prompt: chatValue,
            };
            // await chatStore.sendMessage(payload);
            // await sessionStore.getSessionList();
            setChatValue('');
        } catch (error) {
            console.warn('[ sendMessage error ]', error);
        } finally {
            setIsDisabled(false);
        }
    };

    return (
        <div
            className="input-component absolute bottom-0 z-9 pt-5 pb-10 bg-white flex w-full">
            <form
                className="mx-auto flex gap-3 bg-[var(--ant-primary-color-3)] py-[10px] px-4 border border-black/10 rounded-xl shadow-sm w-[70%]"
                onSubmit={(e) => e.preventDefault()}
            >
                <TextareaAutosize
                    className="textarea m-0 w-full resize-none p-0 focus:ring-0 focus-visible:ring-0 md:pr-2 pl-3 md:pl-0 text-base placeholder:text-[#666] border-none"
                    maxLength={2000}
                    minRows={2}
                    maxRows={8}
                    value={chatValue}
                    placeholder="Please enter your question here..."
                    onKeyDown={onSendMsg}
                    onChange={(e: any) => setChatValue(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className="rounded-lg"
                    onClick={sendMessage}
                    disabled={isDisabled || !chatValue}
                >
                    SEND
                </Button>
            </form>
        </div>
    );
};

export default InputComponent;
