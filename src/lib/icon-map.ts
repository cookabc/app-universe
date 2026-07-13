import {
    ArrowSquareOutIcon,
    BookOpenIcon,
    BriefcaseIcon,
    FileCodeIcon,
    FilmStripIcon,
    GameControllerIcon,
    GlobeIcon,
    type Icon,
    LightbulbIcon,
    LightningIcon,
    MagicWandIcon,
    PaletteIcon,
    PencilIcon,
    PresentationChartIcon,
    RocketIcon,
    SparkleIcon,
    SquaresFourIcon,
    StarIcon,
} from '@phosphor-icons/react'

const iconMap = {
    BookOpen: BookOpenIcon,
    Briefcase: BriefcaseIcon,
    FileCode: FileCodeIcon,
    Film: FilmStripIcon,
    Gamepad: GameControllerIcon,
    Globe: GlobeIcon,
    LayoutGrid: SquaresFourIcon,
    Lightbulb: LightbulbIcon,
    Palette: PaletteIcon,
    Pencil: PencilIcon,
    Presentation: PresentationChartIcon,
    Rocket: RocketIcon,
    Sparkles: SparkleIcon,
    Star: StarIcon,
    Wand: MagicWandIcon,
    Zap: LightningIcon,
} satisfies Record<string, Icon>

export type IconName = keyof typeof iconMap

export function getIcon(name: string): Icon {
    return iconMap[name as IconName] ?? ArrowSquareOutIcon
}
