import { describe, it, expect, spyOn, mock, afterEach } from 'bun:test'
import {
    AppError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    NetworkError,
    handleError,
    logError,
    createErrorHandler,
    isAppError,
    formatErrorResponse,
    safeAsync,
} from './error-handling'

describe('Error Handling Utilities', () => {
    describe('Error Classes', () => {
        it('should instantiate AppError with default values', () => {
            const error = new AppError('Something went wrong')
            expect(error).toBeInstanceOf(Error)
            expect(error).toBeInstanceOf(AppError)
            expect(error.message).toBe('Something went wrong')
            expect(error.code).toBe('UNKNOWN_ERROR')
            expect(error.statusCode).toBe(500)
            expect(error.name).toBe('AppError')
        })

        it('should instantiate AppError with custom values', () => {
            const error = new AppError('Custom error', 'CUSTOM_CODE', 418, { foo: 'bar' })
            expect(error.message).toBe('Custom error')
            expect(error.code).toBe('CUSTOM_CODE')
            expect(error.statusCode).toBe(418)
            expect(error.details).toEqual({ foo: 'bar' })
        })

        it('should instantiate ValidationError', () => {
            const error = new ValidationError('Invalid input', { field: 'email' })
            expect(error).toBeInstanceOf(AppError)
            expect(error.message).toBe('Invalid input')
            expect(error.code).toBe('VALIDATION_ERROR')
            expect(error.statusCode).toBe(400)
            expect(error.details).toEqual({ field: 'email' })
            expect(error.name).toBe('ValidationError')
        })

        it('should instantiate AuthenticationError', () => {
            const error = new AuthenticationError()
            expect(error.message).toBe('Authentication required')
            expect(error.code).toBe('AUTHENTICATION_ERROR')
            expect(error.statusCode).toBe(401)
            expect(error.name).toBe('AuthenticationError')

            const customError = new AuthenticationError('Custom auth error')
            expect(customError.message).toBe('Custom auth error')
        })

        it('should instantiate AuthorizationError', () => {
            const error = new AuthorizationError()
            expect(error.message).toBe('Insufficient permissions')
            expect(error.code).toBe('AUTHORIZATION_ERROR')
            expect(error.statusCode).toBe(403)
            expect(error.name).toBe('AuthorizationError')
        })

        it('should instantiate NotFoundError', () => {
            const error = new NotFoundError()
            expect(error.message).toBe('Resource not found')
            expect(error.code).toBe('NOT_FOUND_ERROR')
            expect(error.statusCode).toBe(404)
            expect(error.name).toBe('NotFoundError')
        })

        it('should instantiate NetworkError', () => {
            const error = new NetworkError()
            expect(error.message).toBe('Network request failed')
            expect(error.code).toBe('NETWORK_ERROR')
            expect(error.statusCode).toBe(502)
            expect(error.name).toBe('NetworkError')
        })
    })

    describe('handleError', () => {
        it('should return the same error if it is already an AppError', () => {
            const originalError = new ValidationError('Validation failed')
            const result = handleError(originalError)
            expect(result).toBe(originalError)
        })

        it('should wrap a standard Error in AppError', () => {
            const error = new Error('Standard error')
            const result = handleError(error)
            expect(result).toBeInstanceOf(AppError)
            expect(result.message).toBe('Standard error')
            expect(result.code).toBe('UNKNOWN_ERROR')
            expect(result.statusCode).toBe(500)
            expect(result.details).toBe(error)
        })

        it('should map authentication errors', () => {
            const error = new Error('Authentication failed')
            const result = handleError(error)
            expect(result).toBeInstanceOf(AuthenticationError)
            expect(result.statusCode).toBe(401)
        })

        it('should map unauthorized errors', () => {
            const error = new Error('Unauthorized access')
            const result = handleError(error)
            expect(result).toBeInstanceOf(AuthenticationError)
            expect(result.statusCode).toBe(401)
        })

        it('should map permission errors', () => {
            const error = new Error('Permission denied')
            const result = handleError(error)
            expect(result).toBeInstanceOf(AuthorizationError)
            expect(result.statusCode).toBe(403)
        })

        it('should map forbidden errors', () => {
            const error = new Error('Forbidden action')
            const result = handleError(error)
            expect(result).toBeInstanceOf(AuthorizationError)
            expect(result.statusCode).toBe(403)
        })

        it('should map not found errors', () => {
            const error = new Error('User not found')
            const result = handleError(error)
            expect(result).toBeInstanceOf(NotFoundError)
            expect(result.statusCode).toBe(404)
        })

        it('should map network errors', () => {
            const error = new Error('Network request failed')
            const result = handleError(error)
            expect(result).toBeInstanceOf(NetworkError)
            expect(result.statusCode).toBe(502)
        })

        it('should map fetch errors', () => {
            const error = new Error('fetch failed')
            const result = handleError(error)
            expect(result).toBeInstanceOf(NetworkError)
            expect(result.statusCode).toBe(502)
        })

        it('should handle string errors', () => {
            const error = 'String error'
            const result = handleError(error)
            expect(result).toBeInstanceOf(AppError)
            expect(result.message).toBe('String error')
        })

        it('should handle unknown objects', () => {
            const error = { foo: 'bar' }
            const result = handleError(error)
            expect(result).toBeInstanceOf(AppError)
            expect(result.message).toBe('An unknown error occurred')
            expect(result.details).toBe(error)
        })
    })

    describe('isAppError', () => {
        it('should return true for AppError instances', () => {
            expect(isAppError(new AppError('test'))).toBe(true)
            expect(isAppError(new ValidationError('test'))).toBe(true)
        })

        it('should return false for standard Error instances', () => {
            expect(isAppError(new Error('test'))).toBe(false)
        })

        it('should return false for non-error objects', () => {
            expect(isAppError({ message: 'test' })).toBe(false)
            expect(isAppError('test')).toBe(false)
            expect(isAppError(null)).toBe(false)
        })
    })

    describe('formatErrorResponse', () => {
        it('should format AppError correctly', () => {
            const error = new ValidationError('Invalid input', { field: 'email' })
            const result = formatErrorResponse(error)
            expect(result).toEqual({
                success: false,
                error: {
                    message: 'Invalid input',
                    code: 'VALIDATION_ERROR',
                    statusCode: 400,
                    details: { field: 'email' },
                },
            })
        })

        it('should format standard Error correctly', () => {
            const error = new Error('Something broke')
            const result = formatErrorResponse(error)
            expect(result.success).toBe(false)
            expect(result.error.message).toBe('Something broke')
            expect(result.error.code).toBe('UNKNOWN_ERROR')
        })
    })

    describe('logError', () => {
        const consoleSpy = spyOn(console, 'error').mockImplementation(() => {})

        afterEach(() => {
            consoleSpy.mockClear()
        })

        it('should log the error with context', () => {
            const error = new AppError('Test error')
            logError(error, 'TEST_CONTEXT')

            expect(consoleSpy).toHaveBeenCalledTimes(1)
            const [message, meta] = consoleSpy.mock.calls[0]
            expect(message).toBe('[TEST_CONTEXT] UNKNOWN_ERROR: Test error')
            expect(meta).toHaveProperty('error')
            expect(meta).toHaveProperty('timestamp')
        })

        it('should use default context if none provided', () => {
            const error = new AppError('Test error')
            logError(error)

            expect(consoleSpy).toHaveBeenCalledTimes(1)
            const [message] = consoleSpy.mock.calls[0]
            expect(message).toBe('[APP] UNKNOWN_ERROR: Test error')
        })
    })

    describe('createErrorHandler', () => {
        const consoleSpy = spyOn(console, 'error').mockImplementation(() => {})

        afterEach(() => {
            consoleSpy.mockClear()
        })

        it('should create a function that logs and handles errors', () => {
            const handler = createErrorHandler('HANDLER_CONTEXT')
            const error = new Error('Test error')

            const result = handler(error)

            expect(result).toBeInstanceOf(AppError)
            expect(consoleSpy).toHaveBeenCalledTimes(1)
            const [message] = consoleSpy.mock.calls[0]
            expect(message).toContain('[HANDLER_CONTEXT]')
        })
    })

    describe('safeAsync', () => {
        const consoleSpy = spyOn(console, 'error').mockImplementation(() => {})

        afterEach(() => {
            consoleSpy.mockClear()
        })

        it('should return data on success', async () => {
            const successFn = async () => 'success data'
            const result = await safeAsync(successFn)

            expect(result).toEqual({ success: true, data: 'success data' })
            expect(consoleSpy).not.toHaveBeenCalled()
        })

        it('should return error on failure', async () => {
            const failureFn = async () => { throw new Error('Async failure') }
            const result = await safeAsync(failureFn, 'ASYNC_TEST')

            expect(result.success).toBe(false)
            if (!result.success) { // Type guard
                expect(result.error).toBeInstanceOf(AppError)
                expect(result.error.message).toBe('Async failure')
            }

            expect(consoleSpy).toHaveBeenCalledTimes(1)
            const [message] = consoleSpy.mock.calls[0]
            expect(message).toContain('[ASYNC_TEST]')
        })
    })
})
