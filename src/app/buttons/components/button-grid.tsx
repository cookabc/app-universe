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
import { PlasticIconButton } from './plastic-icon-button'

const ICON_CONFIG = { size: 22, strokeWidth: 2.5 }

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

interface ButtonGridProps {
    handleButtonClick: (label: string) => void
}

export function ButtonGrid({ handleButtonClick }: ButtonGridProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {ICON_LIST.map((item) => (
                <PlasticIconButton
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    onClick={() => handleButtonClick(item.label)}
                />
            ))}
        </div>
    )
}
