import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { COMMUNITY_STATS } from '../constants'

interface ActionCardProps {
    title: string
    children?: React.ReactNode
    className?: string
}

function ActionCard({ title, children, className }: ActionCardProps) {
    return (
        <div className={`rounded-[15px] border border-border p-6 ${className}`}>
            <h3 className="mb-4 text-xl font-semibold">{title}</h3>
            {children}
            {!children && (
                <Button
                    variant="ghost"
                    className="rounded-full bg-white/20 p-2 hover:bg-white/40 border border-border h-auto"
                >
                    <ArrowRight className="h-5 w-5" />
                </Button>
            )}
        </div>
    )
}

function CommunityCard() {
    return (
        <ActionCard title="Join our global Community" className="bg-accent text-accent-foreground">
            <div className="mb-6 space-y-2 text-sm">
                <p>Over {COMMUNITY_STATS.deployments} new deployments a month</p>
                <p>{COMMUNITY_STATS.members} community members</p>
                <p>{COMMUNITY_STATS.contributors} open-source contributors</p>
            </div>
            <Button
                variant="ghost"
                className="rounded-full bg-white/20 p-2 hover:bg-white/40 border border-border h-auto"
            >
                <ArrowRight className="h-5 w-5" />
            </Button>
        </ActionCard>
    )
}

function NewsletterCard() {
    return (
        <ActionCard title="Subscribe our newsletter" className="bg-card text-card-foreground">
            <div className="flex flex-col sm:flex-row gap-2">
                <Input type="email" placeholder="what's your email?" className="rounded-full border-input" />
                <Button className="rounded-full px-4 py-2 text-primary-foreground bg-primary border w-full sm:w-auto">
                    Subscribe
                </Button>
            </div>
        </ActionCard>
    )
}

export function FreedomSection() {
    return (
        <section className="py-12 sm:py-16 md:py-24 bg-background">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-8 lg:px-12">
                <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-12">
                    <div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
                            Freedom
                            <br />
                            To Build
                        </h2>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <CommunityCard />
                        <ActionCard title="Start a free trial" className="bg-secondary text-secondary-foreground" />
                        <ActionCard title="Schedule a demo" className="bg-primary text-primary-foreground" />
                        <NewsletterCard />
                    </div>
                </div>
            </div>
        </section>
    )
}
