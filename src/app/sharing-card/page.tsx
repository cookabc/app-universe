'use client'

import { ThemeSwitch } from '@/components/theme-switch'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CalendarDaysIcon, MoonIcon, SunIcon } from 'lucide-react'
import { ChangeEvent, useState } from 'react'

interface SharingCardState {
    date: string
    mainText: string
    author: string
    creator: string
    backgroundImage: string
}

const DEFAULT_CARD_DATA: SharingCardState = {
    date: new Date().toISOString().split('T')[0],
    mainText: '伟大的事物从来没有伟大的开端',
    author: '约瑟夫·德·迈斯特',
    creator: '@Anata',
    backgroundImage: '',
}

export default function SharingCard() {
    const [cardData, setCardData] = useState<SharingCardState>(DEFAULT_CARD_DATA)

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            setCardData((prev) => ({
                ...prev,
                backgroundImage: reader.result as string,
            }))
        }
        reader.readAsDataURL(file)
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

interface SharingCardPreviewProps extends SharingCardState {}

export function SharingCardPreview({ date, mainText, author, creator, backgroundImage }: SharingCardPreviewProps) {
    const [isDark, setIsDark] = useState(false)
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
                    isDarkMode={isDark}
                    onCheckedChange={() => setIsDark(!isDark)}
                />
            </div>

            <Card
                className={`overflow-hidden w-full p-6 bg-transparent backdrop-blur-sm ${
                    isDark ? 'text-gray-800' : 'text-white'
                }`}
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
    const formFields = [
        { id: 'date', label: '日期', type: 'date' },
        { id: 'mainText', label: '主文本' },
        { id: 'author', label: '作者' },
        { id: 'creator', label: '创作者' },
        {
            id: 'backgroundImage',
            label: '背景图片',
            type: 'file',
            accept: 'image/*',
            placeholder: '选择背景图片',
            onChange: onImageUpload,
        },
    ]

    return (
        <Card className="w-[500px] p-8">
            <div className="space-y-2">
                {formFields.map((field) => (
                    <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id}>{field.label}</Label>
                        <Input
                            id={field.id}
                            type={field.type}
                            value={field.type !== 'file' ? cardData[field.id as keyof SharingCardState] : undefined}
                            onChange={field.onChange || onInputChange(field.id as keyof SharingCardState)}
                            accept={field.accept}
                            placeholder={field.placeholder}
                        />
                    </div>
                ))}
            </div>
        </Card>
    )
}
