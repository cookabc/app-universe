import { AnimatePresence, motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ApiProvider } from '../types'

interface ProviderStatusProps {
    providers: ApiProvider[]
}

export function ProviderStatus({ providers }: ProviderStatusProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online':
                return 'text-green-500'
            case 'maintenance':
                return 'text-yellow-500'
            case 'offline':
                return 'text-red-500'
            default:
                return 'text-muted-foreground'
        }
    }

    return (
        <Card className="transition-all duration-300 hover:scale-105">
            <CardHeader>
                <CardTitle>API Provider Status</CardTitle>
                <CardDescription>Real-time status of image generation providers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <AnimatePresence>
                    {providers.map((provider) => (
                        <motion.div
                            key={provider.name}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex justify-between items-center text-sm p-2 bg-secondary rounded-md"
                        >
                            <span>{provider.name}</span>
                            <div className="flex items-center gap-2">
                                <span className={getStatusColor(provider.status)}>{provider.status}</span>
                                <span>{provider.responseTime > 0 ? `${provider.responseTime}ms` : ''}</span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </CardContent>
        </Card>
    )
}
