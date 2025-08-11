import { Button } from '@/components/ui/button'
import { WeiboIcon } from '@/components/sm/WeiboIcon'
import { XIcon } from '@/components/sm/XIcon'

interface BottomNavProps {
    activeTab: 'x' | 'weibo'
    setActiveTab: (tab: 'x' | 'weibo') => void
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card shadow-md">
            <div className="flex justify-around items-center h-16">
                <Button
                    variant={activeTab === 'x' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('x')}
                    className="flex-1"
                    aria-label="Switch to X"
                >
                    <XIcon />
                </Button>
                <Button
                    variant={activeTab === 'weibo' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('weibo')}
                    className="flex-1"
                    aria-label="Switch to Weibo"
                >
                    <WeiboIcon />
                </Button>
            </div>
        </nav>
    )
}
