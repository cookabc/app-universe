import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { FeaturesSection } from './components/features-section'
import { FreedomSection } from './components/freedom-section'
import { Header } from './components/header'
import { HeroSection } from './components/hero-section'
import { TrustedBySection } from './components/trusted-by-section'

export default function BentoPage() {
    return (
        <AppErrorBoundary>
            <Header />
            <HeroSection />
            <FeaturesSection />
            <FreedomSection />
            <TrustedBySection />
        </AppErrorBoundary>
    )
}
