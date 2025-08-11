import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { COMMUNITY_STATS, THEME } from './constants'

interface ActionCardProps {
    title: string
    children?: React.ReactNode
    bgColor: string
    textColor?: string
}

function ActionCard({ title, children, bgColor, textColor = 'inherit' }: ActionCardProps) {
    return (
        <div className={`rounded-[15px] border ${bgColor} p-6`} style={{ color: textColor, borderColor: THEME.colors.border }}>
            <h3 className="mb-4 text-xl font-semibold">{title}</h3>
            {children}
            {!children && (
                <Button
                    variant="ghost"
                    className="rounded-full bg-white/20 p-2 hover:bg-white/40 border border-[#19192c] h-auto"
                >
                    <ArrowRight className="h-5 w-5" />
                </Button>
            )}
        </div>
    )
}

function CommunityCard() {
    return (
        <ActionCard title="Join our global Community" bgColor="bg-[#bbf7d0]">
            <div className="mb-6 space-y-2 text-sm">
                <p>Over {COMMUNITY_STATS.deployments} new deployments a month</p>
                <p>{COMMUNITY_STATS.members} community members</p>
                <p>{COMMUNITY_STATS.contributors} open-source contributors</p>
            </div>
            <Button
                variant="ghost"
                className="rounded-full bg-white/20 p-2 hover:bg-white/40 border border-[#19192c] h-auto"
            >
                <ArrowRight className="h-5 w-5" />
            </Button>
        </ActionCard>
    )
}

function NewsletterCard() {
    return (
        <ActionCard title="Subscribe our newsletter" bgColor="bg-white">
            <div className="flex flex-col sm:flex-row gap-2">
                <Input type="email" placeholder="what's your email?" className="rounded-full border-gray-300" />
                <Button
                    className="rounded-full px-4 py-2 text-white border w-full sm:w-auto"
                    style={{ backgroundColor: THEME.colors.primary, borderColor: THEME.colors.border }}
                >
                    Subscribe
                </Button>
            </div>
        </ActionCard>
    )
}

export function FreedomSection() {
    return (
        <section className="py-12 sm:py-16 md:py-24" style={{ backgroundColor: THEME.colors.background }}>
            <div className="mx-auto max-w-[1200px] px-4 sm:px-8 lg:px-12">
                <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-12">
                    <div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold" style={{ color: THEME.colors.primary }}>
                            Freedom
                            <br />
                            To Build
                        </h2>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <CommunityCard />
                        <ActionCard title="Start a free trial" bgColor="bg-[#a78bfa]" textColor={THEME.colors.white} />
                        <ActionCard
                            title="Schedule a demo"
                            bgColor={`bg-[${THEME.colors.primary}]`}
                            textColor={THEME.colors.white}
                        />
                        <NewsletterCard />
                    </div>
                </div>
            </div>
        </section>
    )
}
