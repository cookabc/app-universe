'use client'

import { Moon, type Icon as PhosphorIcon, Sun } from '@phosphor-icons/react'
import * as SwitchPrimitives from '@radix-ui/react-switch'
import { useTheme } from 'next-themes'
import * as React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface ThemeSwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
    width?: number
    height?: number
    lightIcon?: PhosphorIcon
    darkIcon?: PhosphorIcon
    lightColor?: string
    darkColor?: string
}

const DEFAULTS = {
    WIDTH: 80,
    HEIGHT: 44,
    LIGHT_COLOR: 'hsl(var(--muted))',
    DARK_COLOR: 'hsl(var(--foreground))',
    PADDING: 4,
}

const ThemeSwitch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, ThemeSwitchProps>(
    (
        {
            className,
            width = DEFAULTS.WIDTH,
            height = DEFAULTS.HEIGHT,
            lightIcon: LightIcon = Sun,
            darkIcon: DarkIcon = Moon,
            lightColor = DEFAULTS.LIGHT_COLOR,
            darkColor = DEFAULTS.DARK_COLOR,
            ...props
        },
        ref,
    ) => {
        const { theme, setTheme } = useTheme()
        const [mounted, setMounted] = React.useState(false)

        React.useEffect(() => {
            setMounted(true)
        }, [])

        const isDarkMode = mounted ? theme === 'dark' : false
        const label = isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'

        const computeThumbStyles = React.useMemo(() => {
            const thumbSize = height - DEFAULTS.PADDING
            const translateX = width - thumbSize - DEFAULTS.PADDING

            return {
                size: thumbSize,
                transform: isDarkMode ? translateX : 0,
            }
        }, [height, width, isDarkMode])

        const thumbIconStyle = {
            height: computeThumbStyles.size * 0.65,
            width: computeThumbStyles.size * 0.65,
        }

        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <SwitchPrimitives.Root
                        className={cn(
                            'rounded-full relative inline-flex shrink-0 cursor-pointer border border-border',
                            'transition-colors duration-200 ease-in-out',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                            className,
                        )}
                        checked={isDarkMode}
                        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                        aria-label={label}
                        aria-pressed={isDarkMode}
                        {...props}
                        ref={ref}
                        style={{
                            width,
                            height,
                            backgroundColor: isDarkMode ? darkColor : lightColor,
                        }}
                    >
                        <SwitchPrimitives.Thumb
                            className="pointer-events-none rounded-full bg-card text-foreground shadow-sm ring-0 transition duration-200 ease-in-out flex items-center justify-center"
                            style={{
                                height: computeThumbStyles.size,
                                width: computeThumbStyles.size,
                                transform: `translateX(${computeThumbStyles.transform}px)`,
                            }}
                        >
                            {isDarkMode
                                ? DarkIcon && <DarkIcon style={thumbIconStyle} strokeWidth={2} />
                                : LightIcon && <LightIcon style={thumbIconStyle} strokeWidth={2} />}
                        </SwitchPrimitives.Thumb>
                    </SwitchPrimitives.Root>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{label}</p>
                </TooltipContent>
            </Tooltip>
        )
    },
)
ThemeSwitch.displayName = 'ThemeSwitch'

export { ThemeSwitch }
