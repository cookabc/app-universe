import { AnimatePresence, motion } from 'framer-motion'
import { type Message } from '@/app/actions'
import UserIcon from './user-icon'
import AssistantIcon from './assistant-icon'

interface MessageListProps {
    messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
    return (
        <AnimatePresence>
            {messages.map((message, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div
                        className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                    >
                        {message.role === 'user' ? <UserIcon /> : <AssistantIcon />}
                        <div
                            className={`p-3 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card text-card-foreground'} shadow-md`}
                        >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </AnimatePresence>
    )
}
