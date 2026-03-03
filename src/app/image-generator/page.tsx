import { Metadata } from 'next'
import ImageGeneratorClient from './client'

export const metadata: Metadata = {
    title: 'AI Image Generator',
    description: 'Create stunning images with our AI image generator. Enter your prompt and watch your ideas come to life.',
    keywords: ['image generator', 'AI art', 'stable diffusion', 'dalle', 'generative AI'],
}

export default function ImageGeneratorPage() {
    return <ImageGeneratorClient />
}
