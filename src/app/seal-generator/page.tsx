'use client'

import { useCallback, useMemo, useState, useTransition } from 'react'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Constants for seal configuration
const SEAL_CONFIG = {
    SIZE: 300,
    PADDING: 10,
    COLOR: '#FF0000',
    STAR: {
        SCALE: 0.3,
        INNER_RATIO: 0.382, // Golden ratio
    },
    FONT: {
        FAMILY: 'SimSun',
        COMPANY_SIZE_RATIO: 8,
        REGISTRATION_SIZE_RATIO: 10,
        MAX_COMPANY_SIZE: 24,
        MAX_REGISTRATION_SIZE: 18,
    },
    TEXT_RADIUS_OFFSET: 25,
    ANGLES: {
        COMPANY_START: Math.PI * 0.88,
        COMPANY_END: Math.PI * 0.2,
        REGISTRATION_START: Math.PI * 0.25,
        REGISTRATION_END: Math.PI * 0.75,
    },
} as const

interface DrawArcTextProps {
    ctx: CanvasRenderingContext2D
    text: string
    startAngle: number
    endAngle: number
    radius: number
    fontSize: number
    centerX: number
    centerY: number
    isUpsideDown?: boolean
}

export default function SealGenerator() {
    const [companyName, setCompanyName] = useState('北京市某某物业管理有限公司')
    const [registrationNumber, setRegistrationNumber] = useState('123456789012345')
    const [sealImage, setSealImage] = useState('')

    // React 19: useTransition for non-blocking seal generation
    const [isPending, startTransition] = useTransition()

    // React 19: useMemo for seal preview stats
    const sealStats = useMemo(
        () => ({
            companyNameLength: companyName.length,
            registrationLength: registrationNumber.length,
            isValidCompanyName: companyName.length > 0 && companyName.length <= 30,
            isValidRegistration: registrationNumber.length > 0 && registrationNumber.length <= 20,
            canGenerate: companyName.trim() && registrationNumber.trim(),
        }),
        [companyName, registrationNumber],
    )

    const drawArcText = ({
        ctx,
        text,
        startAngle,
        endAngle,
        radius,
        fontSize,
        centerX,
        centerY,
        isUpsideDown = false,
    }: DrawArcTextProps) => {
        ctx.font = `${fontSize}px ${SEAL_CONFIG.FONT.FAMILY}`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        const chars = text.split('')
        const totalAngle = endAngle > startAngle ? endAngle - startAngle : Math.PI * 2 - startAngle + endAngle
        const angleStep = totalAngle / chars.length

        chars.forEach((char, i) => {
            const angle = startAngle + angleStep * i
            const x = centerX + Math.cos(angle) * radius
            const y = centerY + Math.sin(angle) * radius

            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(angle + (isUpsideDown ? -Math.PI / 2 : Math.PI / 2))
            ctx.fillText(char, 0, 0)
            ctx.restore()
        })
    }

    const drawStar = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
        const starRadius = radius * SEAL_CONFIG.STAR.SCALE
        const starInnerRadius = starRadius * SEAL_CONFIG.STAR.INNER_RATIO

        ctx.beginPath()
        for (let i = 0; i < 5; i++) {
            const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2
            const innerAngle = outerAngle + Math.PI / 5

            const outerX = centerX + Math.cos(outerAngle) * starRadius
            const outerY = centerY + Math.sin(outerAngle) * starRadius
            const innerX = centerX + Math.cos(innerAngle) * starInnerRadius
            const innerY = centerY + Math.sin(innerAngle) * starInnerRadius

            i === 0 ? ctx.moveTo(outerX, outerY) : ctx.lineTo(outerX, outerY)
            ctx.lineTo(innerX, innerY)
        }
        ctx.closePath()
        ctx.fill()
    }

    const generateSeal = useCallback(() => {
        // React 19: Use startTransition for non-blocking generation
        startTransition(() => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (!ctx) return

            // Setup canvas
            canvas.width = SEAL_CONFIG.SIZE
            canvas.height = SEAL_CONFIG.SIZE
            const centerX = SEAL_CONFIG.SIZE / 2
            const centerY = SEAL_CONFIG.SIZE / 2
            const radius = SEAL_CONFIG.SIZE / 2 - SEAL_CONFIG.PADDING

            // Clear and set color
            ctx.clearRect(0, 0, SEAL_CONFIG.SIZE, SEAL_CONFIG.SIZE)
            ctx.strokeStyle = SEAL_CONFIG.COLOR
            ctx.fillStyle = SEAL_CONFIG.COLOR

            // Draw outer circle
            ctx.beginPath()
            ctx.lineWidth = 4
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
            ctx.stroke()

            // Draw inner circle
            ctx.beginPath()
            ctx.lineWidth = 2
            ctx.arc(centerX, centerY, radius - 8, 0, Math.PI * 2)
            ctx.stroke()

            // Draw star
            drawStar(ctx, centerX, centerY, radius)

            // Draw company name
            drawArcText({
                ctx,
                text: companyName,
                startAngle: SEAL_CONFIG.ANGLES.COMPANY_START,
                endAngle: SEAL_CONFIG.ANGLES.COMPANY_END,
                radius: radius - SEAL_CONFIG.TEXT_RADIUS_OFFSET,
                fontSize: Math.min(radius / SEAL_CONFIG.FONT.COMPANY_SIZE_RATIO, SEAL_CONFIG.FONT.MAX_COMPANY_SIZE),
                centerX,
                centerY,
            })

            // Draw registration number
            drawArcText({
                ctx,
                text: [...registrationNumber].reverse().join(''),
                startAngle: SEAL_CONFIG.ANGLES.REGISTRATION_START,
                endAngle: SEAL_CONFIG.ANGLES.REGISTRATION_END,
                radius: radius - SEAL_CONFIG.TEXT_RADIUS_OFFSET,
                fontSize: Math.min(
                    radius / SEAL_CONFIG.FONT.REGISTRATION_SIZE_RATIO,
                    SEAL_CONFIG.FONT.MAX_REGISTRATION_SIZE,
                ),
                centerX,
                centerY,
                isUpsideDown: true,
            })

            setSealImage(canvas.toDataURL())
        })
    }, [
        companyName,
        registrationNumber, // Draw registration number
        drawArcText, // Draw star
        drawStar,
    ])

    const handleDownload = () => {
        if (!sealImage) return
        const link = document.createElement('a')
        link.download = 'seal.png'
        link.href = sealImage
        link.click()
    }

    return (
        <AppErrorBoundary>
            <div className="w-full max-w-md mx-auto p-4 space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="companyName">公司名称</Label>
                        <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="registrationNumber">注册号</Label>
                        <Input
                            id="registrationNumber"
                            value={registrationNumber}
                            onChange={(e) => setRegistrationNumber(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-center">
                    {sealImage ? (
                        <img src={sealImage} alt="Generated Seal" className="border border-gray-200 rounded-lg" />
                    ) : (
                        <div className="w-[300px] h-[300px] border border-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                            点击生成按钮预览印章
                        </div>
                    )}
                </div>

                {/* Seal statistics */}
                <div className="text-sm text-gray-600 space-y-1">
                    <div>
                        公司名称: {sealStats.companyNameLength}/30 字符 {sealStats.isValidCompanyName ? '✓' : '⚠️'}
                    </div>
                    <div>
                        注册号: {sealStats.registrationLength}/20 字符 {sealStats.isValidRegistration ? '✓' : '⚠️'}
                    </div>
                </div>

                <div className="flex gap-4 justify-center">
                    <Button
                        onClick={generateSeal}
                        disabled={!sealStats.canGenerate || isPending}
                        className="bg-[#4285f4] hover:bg-[#4285f4]/90 text-white px-8"
                    >
                        {isPending ? '生成中...' : '生成'}
                    </Button>
                    <Button
                        onClick={handleDownload}
                        className="bg-[#34a853] hover:bg-[#34a853]/90 text-white px-8"
                        disabled={!sealImage}
                    >
                        下载
                    </Button>
                </div>
            </div>
        </AppErrorBoundary>
    )
}
