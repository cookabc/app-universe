// Enhanced error handling for the application

export class AppError extends Error {
    constructor(
        message: string,
        public code: string = 'UNKNOWN_ERROR',
        public statusCode: number = 500,
        public details?: unknown,
    ) {
        super(message)
        this.name = 'AppError'
    }
}

export class ValidationError extends AppError {
    constructor(message: string, details?: unknown) {
        super(message, 'VALIDATION_ERROR', 400, details)
        this.name = 'ValidationError'
    }
}

function handleError(error: unknown): AppError {
    if (error instanceof AppError) {
        return error
    }

    if (error instanceof Error) {
        return new AppError(error.message, 'UNKNOWN_ERROR', 500, error)
    }

    return new AppError(typeof error === 'string' ? error : 'An unknown error occurred', 'UNKNOWN_ERROR', 500, error)
}

function logError(error: unknown, context?: string): void {
    const appError = handleError(error)

    console.error(`[${context || 'APP'}] ${appError.code}: ${appError.message}`, {
        error: appError,
        stack: appError.stack,
        details: appError.details,
        timestamp: new Date().toISOString(),
    })
}

// Response formatting for API routes
export function formatErrorResponse(error: unknown) {
    const appError = handleError(error)
    const isProduction = process.env.NODE_ENV === 'production'
    const shouldIncludeDetails = !isProduction || appError.code === 'VALIDATION_ERROR'

    return {
        success: false,
        error: {
            message: appError.message,
            code: appError.code,
            statusCode: appError.statusCode,
            ...(shouldIncludeDetails && appError.details ? { details: appError.details } : {}),
        },
    }
}

// Async error wrapper for try-catch patterns
export async function safeAsync<T>(
    fn: () => Promise<T>,
    context?: string,
): Promise<{ success: true; data: T } | { success: false; error: AppError }> {
    try {
        const data = await fn()
        return { success: true, data }
    } catch (error) {
        const appError = handleError(error)
        logError(appError, context)
        return { success: false, error: appError }
    }
}
