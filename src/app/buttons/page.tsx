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
import { useState } from 'react'

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
    return (
        <div
            className="min-h-screen p-8 flex items-center justify-center"
            style={{
                background: BACKGROUND_STYLES.gradient,
                boxShadow: BACKGROUND_STYLES.innerShadow,
            }}
        >
            <div className="grid grid-cols-5 gap-8">
                {ICON_LIST.map((item, index) => (
                    <PlasticIconButton key={index} icon={item.icon} label={item.label} />
                ))}
            </div>
        </div>
    )
}
