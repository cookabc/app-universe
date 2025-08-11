'use client'

import { useCallback, useMemo, useState, useTransition } from 'react'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { Button } from '@/components/ui/button'
import { SealInputForm } from './components/seal-input-form'
import { SealDisplay } from './components/seal-display'
import { SealStats } from './components/seal-stats'
import { generateSealImage } from './lib/seal-generator'

export default function SealGeneratorClient() {
    const [companyName, setCompanyName] = useState('北京市某某物业管理有限公司')
    const [registrationNumber, setRegistrationNumber] = useState('123456789012345')
    const [sealImage, setSealImage] = useState('')

    const [isPending, startTransition] = useTransition()

    const sealStats = useMemo(
        () => ({
            companyNameLength: companyName.length,
            registrationLength: registrationNumber.length,
            isValidCompanyName: companyName.length > 0 && companyName.length <= 30,
            isValidRegistration: registrationNumber.length > 0 && registrationNumber.length <= 20,
            canGenerate: Boolean(companyName.trim() && registrationNumber.trim()),
        }),
        [companyName, registrationNumber],
    )

    const generateSeal = useCallback(() => {
        startTransition(() => {
            const image = generateSealImage(companyName, registrationNumber)
            setSealImage(image)
        })
    }, [companyName, registrationNumber])

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
                <SealInputForm
                    companyName={companyName}
                    setCompanyName={setCompanyName}
                    registrationNumber={registrationNumber}
                    setRegistrationNumber={setRegistrationNumber}
                />
                <SealDisplay sealImage={sealImage} />
                <SealStats {...sealStats} />
                <div className="flex gap-4 justify-center">
                    <Button
                        onClick={generateSeal}
                        disabled={!sealStats.canGenerate || isPending}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                        aria-busy={isPending}
                    >
                        {isPending ? '生成中...' : '生成'}
                    </Button>
                    <Button
                        onClick={handleDownload}
                        className="bg-green-500 hover:bg-green-600 text-white px-8"
                        disabled={!sealImage}
                    >
                        下载
                    </Button>
                </div>
            </div>
        </AppErrorBoundary>
    )
}
