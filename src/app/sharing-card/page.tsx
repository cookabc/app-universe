'use client'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CalendarDaysIcon, SunIcon, MoonIcon } from 'lucide-react'
import { ChangeEvent, useState } from 'react'
import { Switch } from '@/components/ui/switch'

interface SharingCardState {
    date: string
    mainText: string
    author: string
    creator: string
    backgroundImage: string
}

export default function SharingCard() {
    const [cardData, setCardData] = useState<SharingCardState>({
        date: new Date().toISOString().split('T')[0],
        mainText: '伟大的事物从来没有伟大的开端',
        author: '约瑟夫·德·迈斯特',
        creator: '@Anata',
        backgroundImage: '',
    })

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setCardData((prev) => ({
                    ...prev,
                    backgroundImage: reader.result as string,
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleInputChange = (field: keyof SharingCardState) => (e: ChangeEvent<HTMLInputElement>) => {
        setCardData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }))
    }

    return (
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 min-h-screen p-4">
            <SharingCardPreview {...cardData} />
            <SharingCardForm cardData={cardData} onInputChange={handleInputChange} onImageUpload={handleImageUpload} />
        </div>
    )
}

interface SharingCardPreviewProps {
    date: string
    mainText: string
    author: string
    creator: string
    backgroundImage: string
}

export function SharingCardPreview({ date, mainText, author, creator, backgroundImage }: SharingCardPreviewProps) {
    const [isDark, setIsDark] = useState(true)

    return (
        <Card
            className={`w-[500px] p-12 flex justify-center bg-gradient-to-br from-purple-600 to-blue-600 relative`}
            style={{
                ...(backgroundImage && {
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }),
            }}
        >
            <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                <SunIcon className="w-4 h-4 text-white" />
                <Switch checked={isDark} onCheckedChange={setIsDark} />
                <MoonIcon className="w-4 h-4 text-white" />
            </div>

            <Card
                className={`overflow-hidden w-full p-6 bg-transparent backdrop-blur-sm ${isDark ? 'text-white' : 'text-gray-800'}`}
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

interface SharingCardFormProps {
    cardData: SharingCardState
    onInputChange: (field: keyof SharingCardState) => (e: ChangeEvent<HTMLInputElement>) => void
    onImageUpload: (e: ChangeEvent<HTMLInputElement>) => void
}

export function SharingCardForm({ cardData, onInputChange, onImageUpload }: SharingCardFormProps) {
    return (
        <Card className="w-[500px] p-8">
            <div className="space-y-2">
                <div className="space-y-2">
                    <Label htmlFor="date">日期</Label>
                    <Input id="date" type="date" value={cardData.date} onChange={onInputChange('date')} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="mainText">主文本</Label>
                    <Input id="mainText" value={cardData.mainText} onChange={onInputChange('mainText')} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="author">作者</Label>
                    <Input id="author" value={cardData.author} onChange={onInputChange('author')} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="creator">创作者</Label>
                    <Input id="creator" value={cardData.creator} onChange={onInputChange('creator')} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="backgroundImage">背景图片</Label>
                    <Input
                        id="backgroundImage"
                        type="file"
                        accept="image/*"
                        placeholder="选择背景图片"
                        onChange={onImageUpload}
                    />
                </div>
            </div>
        </Card>
    )
}
