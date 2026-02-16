import React, { type ErrorInfo, type ReactNode } from 'react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
        }
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="flex flex-col items-center justify-center h-screen bg-background-light dark:bg-background-dark p-8">
                    <span className="material-icons-round text-6xl text-red-500 mb-4">error_outline</span>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                        {this.state.error?.message || 'An unexpected error occurred'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                    >
                        Reload App
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}
