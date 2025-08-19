import { CalendarDaysIcon } from 'lucide-react'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card } from '@/components/ui/card'
import type { SharingCardState } from '../types'

export function SharingCardPreview({ date, mainText, author, creator, backgroundImage }: SharingCardState) {
    const switchHeight = 24
    const switchWidth = 36

    return (
        <Card
            className="w-[500px] p-12 bg-gradient-to-br from-purple-600 to-blue-600 relative"
            style={{
                ...(backgroundImage && {
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }),
            }}
        >
            <div className="absolute top-2 right-2 z-10">
                <ThemeSwitch
                    height={switchHeight}
                    width={switchWidth}
                />
            </div>

            <Card
                className={`overflow-hidden w-full p-6 bg-transparent backdrop-blur-xs`}
            >
                <div className="relative flex items-center justify-start gap-2 z-10">
                    <CalendarDaysIcon className="w-6 h-6" />
                    <span className="text-lg font-semibold">{date}</span>
                </div>
                <div className="relative z-10 text-center my-8">
                    <p className="text-2xl font-bold mb-4">{mainText}</p>
                    <p className="text-lg italic">—— {author}</p>
                </div>
                <div className="relative z-10 text-right">
                    <p className="text-sm">{creator}</p>
                </div>
            </Card>
        </Card>
    )
}
