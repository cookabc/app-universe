'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Download, ImageIcon, Loader2, Maximize2, Share2 } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { GenerationRequest } from '../types'

interface ImageDisplayProps {
    generatedImage: string | null
    isLoading: boolean
    requestStatus: GenerationRequest | null
    prompt: string
}

export function ImageDisplay({ generatedImage, isLoading, requestStatus, prompt }: ImageDisplayProps) {
    const { t } = useTranslation()
    const handleDownload = () => {
        if (!generatedImage) return
        const link = document.createElement('a')
        link.href = generatedImage
        link.download = `generated-${Date.now()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Card className="aspect-square md:aspect-[16/10] flex items-center justify-center relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl rounded-2xl group">
            <CardContent className="p-0 w-full h-full">
                <AnimatePresence mode="wait">
                    {isLoading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-full space-y-4 bg-muted/10"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                                <Loader2 className="w-16 h-16 animate-spin text-primary relative z-10" />
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <h3 className="text-xl font-medium animate-pulse">{t('imageGenerator.dreaming')}</h3>
                                {requestStatus && (
                                    <Badge variant="outline" className="animate-pulse bg-background/50">
                                        {t(`imageGenerator.status.${requestStatus.status}`)}
                                    </Badge>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {!isLoading && generatedImage && (
                        <motion.div
                            key="image"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="w-full h-full relative"
                        >
                            <Image
                                src={generatedImage}
                                alt={prompt || 'Generated image'}
                                fill
                                className="object-cover w-full h-full"
                                unoptimized
                            />

                            {/* Overlay Controls */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <p className="text-white/90 line-clamp-2 text-sm mb-4 font-medium max-w-[80%]">
                                        {prompt}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <Button
                                            onClick={handleDownload}
                                            variant="secondary"
                                            size="sm"
                                            className="bg-white/90 hover:bg-white text-black"
                                        >
                                            <Download className="w-4 h-4 mr-2" /> {t('imageGenerator.download')}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="text-white border-white/20 hover:bg-white/10"
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="text-white border-white/20 hover:bg-white/10 ml-auto"
                                        >
                                            <Maximize2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {!isLoading && !generatedImage && (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center"
                        >
                            <div className="w-24 h-24 rounded-full bg-muted/30 flex items-center justify-center mb-6">
                                <ImageIcon className="w-10 h-10 opacity-50" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{t('imageGenerator.readyToCreate')}</h3>
                            <p className="max-w-md mx-auto opacity-70">{t('imageGenerator.enterPrompt')}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    )
}
