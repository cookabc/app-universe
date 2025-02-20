'use client'

import { cn } from '@/lib/utils'
import * as SwitchPrimitives from '@radix-ui/react-switch'
import { type LucideIcon, MoonIcon, SunIcon } from 'lucide-react'
import * as React from 'react'

export interface ThemeSwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
    width?: number
    height?: number
    isDarkMode?: boolean
    lightIcon?: LucideIcon
    darkIcon?: LucideIcon
    lightColor?: string
    darkColor?: string
}

const DEFAULTS = {
    WIDTH: 80,
    HEIGHT: 44,
    LIGHT_COLOR: '#fbbf24',
    DARK_COLOR: '#312E81',
    PADDING: 4,
}

const ThemeSwitch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, ThemeSwitchProps>(
    (
        {
            className,
            width = DEFAULTS.WIDTH,
            height = DEFAULTS.HEIGHT,
            isDarkMode = false,
            lightIcon: LightIcon = SunIcon,
            darkIcon: DarkIcon = MoonIcon,
            lightColor = DEFAULTS.LIGHT_COLOR,
            darkColor = DEFAULTS.DARK_COLOR,
            ...props
        },
        ref,
    ) => {
        const computeThumbStyles = React.useMemo(() => {
            const thumbSize = height - DEFAULTS.PADDING
            const translateX = width - thumbSize - DEFAULTS.PADDING

            return {
                size: thumbSize,
                transform: isDarkMode ? translateX : 0,
            }
        }, [height, width, isDarkMode])

        const thumbIconStyle = {
            height: computeThumbStyles.size * 0.75,
            width: computeThumbStyles.size * 0.75,
        }

        return (
            <SwitchPrimitives.Root
                className={cn(
                    'rounded-full relative inline-flex shrink-0 cursor-pointer border-2 border-transparent',
                    'transition-colors duration-200 ease-in-out',
                    'focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75',
                    className,
                )}
                checked={isDarkMode}
                {...props}
                ref={ref}
                style={{
                    width,
                    height,
                    backgroundColor: isDarkMode ? darkColor : lightColor,
                }}
            >
                <SwitchPrimitives.Thumb
                    className="pointer-events-none rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center"
                    style={{
                        height: computeThumbStyles.size,
                        width: computeThumbStyles.size,
                        transform: `translateX(${computeThumbStyles.transform}px)`,
                    }}
                >
                    {isDarkMode
                        ? DarkIcon && <DarkIcon style={thumbIconStyle} />
                        : LightIcon && <LightIcon style={thumbIconStyle} />}
                </SwitchPrimitives.Thumb>
            </SwitchPrimitives.Root>
        )
    },
)
ThemeSwitch.displayName = 'ThemeSwitch'

export { ThemeSwitch }
