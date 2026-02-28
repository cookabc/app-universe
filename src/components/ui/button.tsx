import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default: 'bg-primary bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-lg hover:-translate-y-0.5 hover:shadow-primary/20 transition-all duration-300',
                destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
                outline: 'border border-primary/20 bg-background/50 shadow-sm hover:bg-primary/10 hover:text-foreground transition-all',
                secondary: 'bg-secondary/50 text-secondary-foreground shadow-sm hover:bg-secondary/80 transition-all',
                ghost: 'hover:bg-primary/10 hover:text-foreground transition-all',
                link: 'text-primary underline-offset-4 hover:underline text-gradient',
            },
            size: {
                default: 'h-9 px-5 py-2',
                sm: 'h-8 rounded-full px-4 text-xs',
                lg: 'h-10 rounded-full px-8',
                icon: 'h-9 w-9 rounded-full',
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
        return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    },
)
Button.displayName = 'Button'

export { Button }
