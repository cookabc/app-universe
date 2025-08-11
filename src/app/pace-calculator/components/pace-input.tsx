import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface PaceInputProps {
    minutes: string
    setMinutes: (value: string) => void
    seconds: string
    setSeconds: (value: string) => void
    inputMode: 'select' | 'input'
    setInputMode: (value: 'select' | 'input') => void
    calculatePace: () => void
    isPending: boolean
}

export function PaceInput({
    minutes,
    setMinutes,
    seconds,
    setSeconds,
    inputMode,
    setInputMode,
    calculatePace,
    isPending,
}: PaceInputProps) {
    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value === '' || (parseInt(value) >= 0 && parseInt(value) < 60)) {
            setMinutes(value)
        }
    }

    const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value === '') {
            setSeconds('')
            return
        }
        const num = parseInt(value)
        if (!Number.isNaN(num) && num >= 0 && num < 60) {
            setSeconds(num.toString().padStart(2, '0'))
        }
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">预期配速</h2>
            <div className="flex gap-6 items-end mb-6">
                <div className="space-y-2">
                    <Label htmlFor="minutes" className="text-base">
                        分
                    </Label>
                    {inputMode === 'select' ? (
                        <Select value={minutes} onValueChange={setMinutes}>
                            <SelectTrigger id="minutes" className="w-[100px]" onClick={() => setInputMode('input')}>
                                <SelectValue placeholder="分" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 15 }, (_, i) => (
                                    <SelectItem key={i} value={i.toString()}>
                                        {i}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <Input
                            type="number"
                            value={minutes}
                            onChange={handleMinutesChange}
                            className="w-[100px]"
                            onBlur={() => minutes === '' && setMinutes('0')}
                        />
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="seconds" className="text-base">
                        秒
                    </Label>
                    {inputMode === 'select' ? (
                        <Select value={seconds} onValueChange={(v) => setSeconds(v.padStart(2, '0'))}>
                            <SelectTrigger id="seconds" className="w-[100px]" onClick={() => setInputMode('input')}>
                                <SelectValue placeholder="秒" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 60 }, (_, i) => (
                                    <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                                        {i.toString().padStart(2, '0')}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <Input
                            type="number"
                            value={parseInt(seconds)}
                            onChange={handleSecondsChange}
                            className="w-[100px]"
                            onBlur={() => seconds === '' && setSeconds('00')}
                        />
                    )}
                </div>
                <Button onClick={calculatePace} disabled={isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    {isPending ? '计算中...' : '计算'}
                </Button>
            </div>
        </div>
    )
}
