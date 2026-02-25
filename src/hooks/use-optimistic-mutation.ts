'use client'

import { useCallback, useState, useTransition } from 'react'

// Optimistic mutations hook
export function useOptimisticMutation<T, U>(
    mutationFn: (data: U) => Promise<T>,
    options: {
        onSuccess?: (data: T) => void
        onError?: (error: Error) => void
        optimisticUpdate?: (data: U) => T
    } = {},
) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<Error | null>(null)

    const mutate = useCallback(
        async (data: U) => {
            setError(null)

            // Optimistic update if provided
            if (options.optimisticUpdate) {
                const optimisticResult = options.optimisticUpdate(data)
                options.onSuccess?.(optimisticResult)
            }

            try {
                const result = await mutationFn(data)

                startTransition(() => {
                    options.onSuccess?.(result)
                })

                return result
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Mutation failed')

                startTransition(() => {
                    setError(error)
                    options.onError?.(error)
                })

                throw error
            }
        },
        [mutationFn, options],
    )

    return {
        mutate,
        isPending,
        error,
    }
}
