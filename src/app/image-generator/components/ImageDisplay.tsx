import { AnimatePresence, motion } from 'framer-motion'
import { Download, Loader } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { GenerationRequest } from '../types'

interface ImageDisplayProps {
    generatedImage: string | null
    isLoading: boolean
    requestStatus: GenerationRequest | null
}

export function ImageDisplay({ generatedImage, isLoading, requestStatus }: ImageDisplayProps) {
    const handleDownload = () => {
        if (!generatedImage) return
        const link = document.createElement('a')
        link.href = generatedImage
        link.download = 'generated-image.png'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Card className="aspect-square flex items-center justify-center relative overflow-hidden transition-all duration-300 hover:scale-105">
            <CardContent className="p-0 w-full h-full">
                <AnimatePresence mode="wait">
                    {isLoading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center justify-center h-full"
                        >
                            <Loader className="w-16 h-16 animate-spin" />
                            {requestStatus && <p className="mt-4 text-lg">Status: {requestStatus.status}</p>}
                        </motion.div>
                    )}
                    {!isLoading && generatedImage && (
                        <motion.div
                            key="image"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full h-full"
                        >
                            <Image
                                src={generatedImage}
                                alt="Generated image"
                                width={1024}
                                height={1024}
                                className="object-cover w-full h-full rounded-lg"
                            />
                            <Button onClick={handleDownload} className="absolute bottom-4 right-4" variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                        </motion.div>
                    )}
                    {!isLoading && !generatedImage && (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center h-full text-muted-foreground"
                        >
                            Your generated image will appear here.
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    )
}
