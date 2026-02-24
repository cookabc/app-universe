'use client'

import { useActionState, useEffect, useOptimistic, useState, useTransition } from 'react'

interface FormState {
    success?: boolean
    error?: string
    data?: any
}

interface OptimizedFormProps {
    action: (prevState: FormState, formData: FormData) => Promise<FormState>
    children: React.ReactNode
    className?: string
    onSuccess?: (data: any) => void
    onError?: (error: string) => void
}

// Enhanced form component using React 19's useActionState
export function OptimizedForm({ action, children, className = '', onSuccess, onError }: OptimizedFormProps) {
    const [state, formAction, isPending] = useActionState(action, {
        success: false,
    })
    const [isPendingTransition, startTransition] = useTransition()

    // Handle success/error callbacks
    useEffect(() => {
        if (state.success && onSuccess && state.data) {
            onSuccess(state.data)
        }
        if (state.error && onError) {
            onError(state.error)
        }
    }, [state.success, state.error, state.data, onSuccess, onError])

    const handleSubmit = (formData: FormData) => {
        startTransition(() => {
            formAction(formData)
        })
    }

    return (
        <form action={handleSubmit} className={className}>
            {children}
            {state.error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-700 text-sm">{state.error}</p>
                </div>
            )}
            {state.success && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-700 text-sm">Success!</p>
                </div>
            )}
            <FormStatus isPending={isPending || isPendingTransition} />
        </form>
    )
}

function FormStatus({ isPending }: { isPending: boolean }) {
    if (!isPending) return null

    return (
        <div className="mt-4 flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Processing...</span>
        </div>
    )
}

// Optimistic UI component for instant feedback
export function OptimisticList<T extends { id: string }>({
    items,
    addAction,
    removeAction,
    renderItem,
}: {
    items: T[]
    addAction: (item: Omit<T, 'id'>) => Promise<T>
    removeAction: (id: string) => Promise<void>
    renderItem: (item: T, onRemove: () => void) => React.ReactNode
}) {
    const [optimisticItems, addOptimisticItem] = useOptimistic(items, (state, newItem: T) => [...state, newItem])
    const [optimisticRemovals, removeOptimisticItem] = useOptimistic(optimisticItems, (state, removedId: string) =>
        state.filter((item) => item.id !== removedId),
    )

    const _handleAdd = async (item: Omit<T, 'id'>) => {
        const tempItem = { ...item, id: `temp-${Date.now()}` } as T
        addOptimisticItem(tempItem)

        try {
            await addAction(item)
        } catch (error) {
            console.error('Failed to add item:', error)
        }
    }

    const handleRemove = async (id: string) => {
        removeOptimisticItem(id)

        try {
            await removeAction(id)
        } catch (error) {
            console.error('Failed to remove item:', error)
        }
    }

    return (
        <div className="space-y-2">
            {optimisticRemovals.map((item) => renderItem(item, () => handleRemove(item.id)))}
        </div>
    )
}

// Enhanced input components with better UX
export function OptimizedInput({
    name,
    type = 'text',
    placeholder,
    required = false,
    className = '',
    ...props
}: {
    name: string
    type?: string
    placeholder?: string
    required?: boolean
    className?: string
    [key: string]: any
}) {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)

    return (
        <div className="relative">
            <input
                name={name}
                type={type}
                placeholder={placeholder}
                required={required}
                className={`
                    w-full px-3 py-2 border border-gray-300 rounded-md
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-200
                    ${isFocused ? 'ring-2 ring-blue-500' : ''}
                    ${className}
                `}
                onFocus={() => setIsFocused(true)}
                onBlur={(e) => {
                    setIsFocused(false)
                    setHasValue(e.target.value.length > 0)
                }}
                onChange={(e) => setHasValue(e.target.value.length > 0)}
                {...props}
            />
            {required && !hasValue && <span className="absolute right-3 top-2 text-red-500 text-sm">*</span>}
        </div>
    )
}

export function OptimizedButton({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className = '',
    ...props
}: {
    children: React.ReactNode
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    loading?: boolean
    className?: string
    [key: string]: any
}) {
    const baseClasses =
        'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'

    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    }

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    }

    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={`
                ${baseClasses}
                ${variantClasses[variant]}
                ${sizeClasses[size]}
                ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
                ${className}
            `}
            {...props}
        >
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>}
            {children}
        </button>
    )
}
