interface SealDisplayProps {
    sealImage: string
}

export function SealDisplay({ sealImage }: SealDisplayProps) {
    return (
        <div className="flex justify-center">
            {sealImage ? (
                <img src={sealImage} alt="Generated Seal" className="border border-border rounded-lg" />
            ) : (
                <div className="w-[300px] h-[300px] border border-border rounded-lg flex items-center justify-center text-muted-foreground">
                    点击生成按钮预览印章
                </div>
            )}
        </div>
    )
}
