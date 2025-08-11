'use client'

import { type ChangeEvent, useState } from 'react'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { SharingCardForm } from './components/sharing-card-form'
import { SharingCardPreview } from './components/sharing-card-preview'
import { DEFAULT_CARD_DATA } from './constants'
import type { SharingCardState } from './types'

export default function SharingCardClient() {
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
        <AppErrorBoundary>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-4 min-h-screen p-4 bg-background">
                <SharingCardPreview {...cardData} />
                <SharingCardForm cardData={cardData} onInputChange={handleInputChange} onImageUpload={handleImageUpload} />
            </div>
        </AppErrorBoundary>
    )
}
