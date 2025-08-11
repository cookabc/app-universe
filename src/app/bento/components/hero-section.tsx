import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
    return (
        <section className="bg-background py-12 px-4 sm:px-8 lg:px-12 sm:py-16 md:py-24">
            <div className="mx-auto max-w-[1200px]">
                <div className="rounded-[15px] border border-border bg-card p-6 sm:p-8 lg:p-12">
                    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                        <div className="flex flex-col justify-center">
                            <h1 className="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl xl:text-6xl">
                                Unified Inference Platform
                                <br />
                                for any model, on any cloud
                            </h1>
                            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground">
                                Build scalable AI systems with unparalleled speed and flexibility. Deploy in your
                                cloud, iterate faster, and scale at a lower cost.
                            </p>
                            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    className="rounded-full bg-secondary px-6 py-3 text-secondary-foreground hover:bg-secondary/90 border border-border w-full sm:w-auto"
                                >
                                    Get Started
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="rounded-full bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90 border border-border w-full sm:w-auto"
                                >
                                    Bring Your Own Cloud
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center justify-center mt-8 lg:mt-0">
                            <div className="relative h-[300px] w-full max-w-[400px] lg:h-[400px] lg:w-[400px]">
                                <svg
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 400 400"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect width="400" height="400" fill="#E5E7EB" />
                                    <path
                                        d="M200 100L300 150V250L200 300L100 250V150L200 100Z"
                                        fill="#9CA3AF"
                                        stroke="#4B5563"
                                        strokeWidth="4"
                                    />
                                    <path
                                        d="M200 150L250 175V225L200 250L150 225V175L200 150Z"
                                        fill="#6B7280"
                                        stroke="#4B5563"
                                        strokeWidth="4"
                                    />
                                    <circle cx="200" cy="200" r="20" fill="#10B981" />
                                    <path d="M180 220L220 180M180 180L220 220" stroke="#047857" strokeWidth="4" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
