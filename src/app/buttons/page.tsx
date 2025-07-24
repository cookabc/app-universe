'use client'

import {
    Bed,
    Bell,
    Camera,
    Car,
    CloudIcon as CloudSync,
    Globe,
    Headphones,
    Heart,
    ImageIcon,
    Lamp,
    Mail,
    MapPin,
    Search,
    ShirtIcon as ShirtRound,
    ShoppingCart,
    Smile,
    Sparkle,
    Tag,
    ThumbsUp,
    Watch,
} from 'lucide-react'
import { useCallback, useMemo, useState, useTransition } from 'react'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'

interface PlasticIconButtonProps {
    icon: React.ReactNode
    label: string
    onClick?: () => void
}

const BUTTON_STYLES = {
    backgroundColor: '#ffffff',
    iconColor: '#000000',
    boxShadowPressed: '0 2px 4px rgba(0, 0, 0, 0.1)',
    boxShadowDefault: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease',
}

const ICON_CONFIG = {
    size: 22,
    strokeWidth: 2.5,
}

const BACKGROUND_STYLES = {
    gradient: `
        linear-gradient(to right, #fdf6e3, #eee8d5),
        repeating-linear-gradient(
            45deg,
            rgba(147, 161, 161, 0.03) 0px,
            rgba(147, 161, 161, 0.03) 1px,
            transparent 1px,
            transparent 4px
        )
    `,
    innerShadow: 'inset 0 0 80px rgba(181, 137, 0, 0.1)',
}

function PlasticIconButton({ icon, label, onClick }: PlasticIconButtonProps) {
    const [isPressed, setIsPressed] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    const getTransform = () => {
        if (isPressed) return 'translateY(1px) scale(0.95)'
        if (isHovered) return 'translateY(0) scale(1.1)'
        return 'translateY(0) scale(1)'
    }

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            className="relative w-16 h-16 rounded-full flex items-center justify-center"
            style={{
                background: BUTTON_STYLES.backgroundColor,
                transform: getTransform(),
                transition: BUTTON_STYLES.transition,
                boxShadow: isPressed ? BUTTON_STYLES.boxShadowPressed : BUTTON_STYLES.boxShadowDefault,
            }}
            aria-label={label}
        >
            <div
                className="relative w-7 h-7 flex items-center justify-center"
                style={{ color: BUTTON_STYLES.iconColor }}
            >
                {icon}
            </div>
        </button>
    )
}

const ICON_LIST = [
    { icon: <ShoppingCart {...ICON_CONFIG} />, label: 'Cart' },
    { icon: <Camera {...ICON_CONFIG} />, label: 'Camera' },
    { icon: <Sparkle {...ICON_CONFIG} />, label: 'Sparkle' },
    { icon: <Car {...ICON_CONFIG} />, label: 'Car' },
    { icon: <Globe {...ICON_CONFIG} />, label: 'Globe' },
    { icon: <ThumbsUp {...ICON_CONFIG} />, label: 'Like' },
    { icon: <Bell {...ICON_CONFIG} />, label: 'Notifications' },
    { icon: <Search {...ICON_CONFIG} />, label: 'Search' },
    { icon: <Lamp {...ICON_CONFIG} />, label: 'Lamp' },
    { icon: <Heart {...ICON_CONFIG} />, label: 'Favorites' },
    { icon: <Headphones {...ICON_CONFIG} />, label: 'Audio' },
    { icon: <ImageIcon {...ICON_CONFIG} />, label: 'Images' },
    { icon: <CloudSync {...ICON_CONFIG} />, label: 'Sync' },
    { icon: <ShirtRound {...ICON_CONFIG} />, label: 'Clothing' },
    { icon: <Smile {...ICON_CONFIG} />, label: 'Emoji' },
    { icon: <Mail {...ICON_CONFIG} />, label: 'Mail' },
    { icon: <Watch {...ICON_CONFIG} />, label: 'Time' },
    { icon: <Tag {...ICON_CONFIG} />, label: 'Tags' },
    { icon: <MapPin {...ICON_CONFIG} />, label: 'Location' },
    { icon: <Bed {...ICON_CONFIG} />, label: 'Furniture' },
]

export default function IconGrid() {
    // React 19: useTransition for smooth interactions
    const [_isPending, startTransition] = useTransition()
    const [clickedButtons, setClickedButtons] = useState<string[]>([])

    // React 19: useMemo for button statistics
    const buttonStats = useMemo(
        () => ({
            totalButtons: ICON_LIST.length,
            clickedCount: clickedButtons.length,
            categories: ['Shopping', 'Media', 'Communication', 'Navigation', 'Utilities'],
            completionRate: Math.round((clickedButtons.length / ICON_LIST.length) * 100),
        }),
        [clickedButtons.length],
    )

    // React 19: useCallback for optimized click handling
    const handleButtonClick = useCallback((label: string) => {
        startTransition(() => {
            setClickedButtons((prev) => (prev.includes(label) ? prev : [...prev, label]))
        })
    }, [])

    return (
        <AppErrorBoundary>
            <div
                className="min-h-screen p-8 flex flex-col items-center justify-center"
                style={{
                    background: BACKGROUND_STYLES.gradient,
                    boxShadow: BACKGROUND_STYLES.innerShadow,
                }}
            >
                {/* Button statistics */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold mb-4">Interactive Button Showcase</h1>
                    <div className="text-sm text-gray-600 space-x-4">
                        <span>Total: {buttonStats.totalButtons}</span>
                        <span>Clicked: {buttonStats.clickedCount}</span>
                        <span>Progress: {buttonStats.completionRate}%</span>
                    </div>
                </div>
                <div className="grid grid-cols-5 gap-8">
                    {ICON_LIST.map((item, index) => (
                        <PlasticIconButton
                            key={index}
                            icon={item.icon}
                            label={item.label}
                            onClick={() => handleButtonClick(item.label)}
                        />
                    ))}
                </div>

                {/* Progress indicator */}
                {buttonStats.clickedCount > 0 && (
                    <div className="mt-8 text-center">
                        <div className="w-64 bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${buttonStats.completionRate}%` }}
                            />
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                            {buttonStats.clickedCount === buttonStats.totalButtons
                                ? '🎉 All buttons clicked!'
                                : `${buttonStats.totalButtons - buttonStats.clickedCount} buttons remaining`}
                        </p>
                    </div>
                )}
            </div>
        </AppErrorBoundary>
    )
}
