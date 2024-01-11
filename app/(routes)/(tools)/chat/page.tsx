import Chat from "./components/Chat";

export default function Page() {
    return (<div className="mt-16 relative flex h-full max-w-full flex-1 overflow-hidden">
        <div className="chat-right overflow-y-auto bg-[var(--chat-bg-color)] w-full h-full scroll-smooth">
            <Chat/>
        </div>
    </div>)
}
