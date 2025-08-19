import { AnimatePresence, motion } from 'framer-motion'
import { Loader } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { QueueState } from '../types'

interface QueueStatusProps {
    status: QueueState | null
}

export function QueueStatus({ status }: QueueStatusProps) {
    if (!status) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Queue Status</CardTitle>
                    <CardDescription>Loading queue status...</CardDescription>
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
                <CardTitle>Queue Status</CardTitle>
                <CardDescription>
                    {allRequests.length} requests in queue. {activeWorkers}/{maxWorkers} workers active.
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
                                <span>Request ID: {req.id.substring(0, 12)}...</span>
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
