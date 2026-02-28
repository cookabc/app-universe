/**
 * [INPUT]: 依赖 @radix-ui/react-slot、cva、cn 工具函数
 * [OUTPUT]: 对外提供 Button 按钮组件，包含微拟物变体
 * [POS]: ui/ 的核心交互组件，支持多种视觉风格
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '../../lib/utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default:
                    'bg-primary bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.97] transition-all duration-300',
                destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                outline: 'border border-primary/20 bg-background/50 shadow-sm hover:bg-primary/10 hover:text-foreground transition-all',
                secondary: 'bg-secondary/50 text-secondary-foreground shadow-sm hover:bg-secondary/80 transition-all',
                ghost: 'hover:bg-primary/10 hover:text-foreground rounded-full transition-all',
                link: 'text-primary underline-offset-4 hover:underline text-gradient',
                // 微拟物渐变变体
                gradient:
                    'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.97] transition-all duration-300',
            },
            size: {
                default: 'h-10 px-6 py-2 rounded-full',
                sm: 'h-9 px-4 rounded-full',
                lg: 'h-12 px-8 rounded-full',
                icon: 'h-10 w-10 rounded-full',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
)

interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button'

        // 为 gradient 变体添加渐变背景样式 (now strictly using the unified global utility gradient mostly, but keep this for strict backward compatibility if explicitly needed)
        const gradientStyle = undefined

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                style={gradientStyle}
                ref={ref}
                {...props}
            />
        )
    },
)
Button.displayName = 'Button'

export { Button }
