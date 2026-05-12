'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Loader } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { QueueState } from '../types'

interface QueueStatusProps {
    status: QueueState | null
}

export function QueueStatus({ status }: QueueStatusProps) {
    const { t } = useTranslation()
    if (!status) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{t('imageGenerator.queueStatus')}</CardTitle>
                    <CardDescription>{t('imageGenerator.loadingQueueStatus')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Loader className="w-8 h-8 animate-spin" />
                </CardContent>
            </Card>
        )
    }

    const { queue, processing, activeWorkers, maxWorkers } = status
    const allRequests = [...processing, ...queue]

    return (
        <Card className="transition-all duration-300 hover:scale-105">
            <CardHeader>
                <CardTitle>{t('imageGenerator.queueStatus')}</CardTitle>
                <CardDescription>
                    {allRequests.length} {t('imageGenerator.requestsInQueue')} {activeWorkers}/{maxWorkers}{' '}
                    {t('imageGenerator.workersActive')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Progress value={(activeWorkers / maxWorkers) * 100} className="mb-4" />
                <div className="space-y-2">
                    <AnimatePresence>
                        {allRequests.map((req) => (
                            <motion.div
                                key={req.id}
                                layout
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="flex justify-between items-center text-sm p-2 bg-secondary rounded-md"
                            >
                                <span>
                                    {t('imageGenerator.requestId')}: {req.id.substring(0, 12)}...
                                </span>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                        req.status === 'processing'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-secondary text-secondary-foreground'
                                    }`}
                                >
                                    {req.status}
                                </span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    )
}
