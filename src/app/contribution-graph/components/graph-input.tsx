interface GraphInputProps {
    inputText: string
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    maxLength: number
    remainingChars: number
}

export function GraphInput({ inputText, handleChange, maxLength, remainingChars }: GraphInputProps) {
    return (
        <>
            <input
                type="text"
                placeholder={`Enter up to ${maxLength} characters`}
                value={inputText}
                onChange={handleChange}
                className="w-full p-1.5 text-sm text-foreground bg-card border border-input rounded-md outline-none shadow-inner-sm mb-4"
                maxLength={maxLength}
                aria-describedby="input-help"
            />
            <div id="input-help" className="text-xs text-muted-foreground -mt-2">
                {remainingChars} characters remaining
            </div>
        </>
    )
}
