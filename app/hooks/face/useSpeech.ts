import {useEffect} from "react";
import {MoteCamAdviceMessage} from "@/app/components/face/MoteCamMessage";
import {useLocale} from "./useLocale";


const useSpeech = (messages: MoteCamAdviceMessage[]) => {
    const {languageCode} = useLocale()

    useEffect(() => {
        const candidates = messages.filter(msg => {
            return !msg.fulfilled
        })
        if (candidates.length > 0) {
            const message = selectMessage(candidates)
            // console.log(`Selected Message: ${message}`);
            if (message) {
                speakAdvice(message)
            }
        }
    }, [messages])

    const selectMessage = (msg: MoteCamAdviceMessage[]): string => {
        const idx = Math.floor(Math.random() * msg.length)
        return msg[idx].message
    }

    const speakAdvice = (message: string) => {
        if (message !== 'undefined' && typeof speechSynthesis !== 'undefined' && !speechSynthesis.speaking) {
            speechSynthesis.cancel(); // for chrome bugs
            const utterance = new SpeechSynthesisUtterance();
            utterance.text = message;
            utterance.lang = languageCode;
            speechSynthesis.speak(utterance)
        }
    }
}

const speakMessage = (message: string, langCode: string) => {
    speechSynthesis.cancel(); // for chrome bugs
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = message;
    utterance.lang = langCode;
    speechSynthesis.speak(utterance)
}

export {useSpeech, speakMessage}
