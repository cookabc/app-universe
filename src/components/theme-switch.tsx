'use client'

import { MonitorIcon, MoonIcon, type Icon as PhosphorIcon, SunIcon } from '@phosphor-icons/react'
import { useTheme } from 'next-themes'
import * as React from 'react'
import { flushSync } from 'react-dom'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useI18nReady } from '@/hooks/useI18nReady'
import { cn } from '@/lib/utils'

const themeIcons: Record<string, PhosphorIcon> = {
    system: MonitorIcon,
    light: SunIcon,
    dark: MoonIcon,
}

const cycle: Record<string, string> = {
    system: 'light',
    light: 'dark',
    dark: 'system',
}

function prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function startThemeTransition(
    nextTheme: string,
    setTheme: (theme: string) => void,
    clickEvent: React.MouseEvent<HTMLButtonElement>,
) {
    if (!document.startViewTransition || prefersReducedMotion()) {
        setTheme(nextTheme)
        return
    }

    document.documentElement.classList.add('theme-transition')

    const x = clickEvent.clientX
    const y = clickEvent.clientY
    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

    const transition = document.startViewTransition(() => {
        flushSync(() => setTheme(nextTheme))
    })

    const cleanup = () => {
        document.documentElement.classList.remove('theme-transition')
    }

    transition.ready
        .then(() =>
            document.documentElement.animate(
                {
                    clipPath: [`circle(0% at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
                },
                {
                    duration: 500,
                    easing: 'ease-in-out',
                    pseudoElement: '::view-transition-new(root)',
                },
            ),
        )
        .catch(() => {
            // Browser cancelled the transition; theme is already updated.
        })
        .finally(cleanup)
}

interface ThemeSwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ThemeSwitch = React.forwardRef<HTMLButtonElement, ThemeSwitchProps>(({ className, ...props }, ref) => {
    const { theme = 'system', setTheme } = useTheme()
    const { t, isReady } = useI18nReady()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const themeLabels: Record<string, string> = {
        system: isReady ? t('theme.system') : 'System',
        light: isReady ? t('theme.light') : 'Light',
        dark: isReady ? t('theme.dark') : 'Dark',
    }

    const current = mounted ? theme : 'system'
    const next = cycle[current]
    const Icon = themeIcons[current]
    const label = isReady
        ? t('theme.label', { current: themeLabels[current], next: themeLabels[next] })
        : `Theme: ${themeLabels[current]}. Click to switch to ${themeLabels[next]}.`

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    ref={ref}
                    type="button"
                    onClick={(event) => startThemeTransition(next, setTheme, event)}
                    aria-label={label}
                    className={cn(
                        'inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-inner)]',
                        'border border-border bg-card text-muted-foreground',
                        'transition-all duration-200',
                        'hover:border-primary/30 hover:text-foreground',
                        'active:translate-y-px active:scale-[0.98]',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                        className,
                    )}
                    {...props}
                >
                    <Icon className="h-3.5 w-3.5" weight="regular" />
                </button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{label}</p>
            </TooltipContent>
        </Tooltip>
    )
})
ThemeSwitch.displayName = 'ThemeSwitch'

export { ThemeSwitch }
