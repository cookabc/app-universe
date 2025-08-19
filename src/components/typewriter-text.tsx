interface TypewriterTextProps {
    text: string
}

const cursorStyles = [
    "after:content-['']",
    'after:absolute',
    'after:right-[-12px]',
    'after:top-[-4px]',
    'after:w-[8px]',
    'after:h-[120%]',
    'after:bg-blue-500',
    'after:animate-blink',
].join(' ')

export const TypewriterText = ({ text }: TypewriterTextProps) => {
    return (
        <span className={`relative inline-block text-blue-500 ${cursorStyles}`}>
            <span>{text}</span>
        </span>
    )
}
