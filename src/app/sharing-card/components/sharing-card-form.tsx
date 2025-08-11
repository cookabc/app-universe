import { type ChangeEvent } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { SharingCardState } from '../types'

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
