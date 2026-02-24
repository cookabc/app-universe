// Centralized type definitions for the application

// API Response Types
export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    error?: string
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    hasNext: boolean
    hasPrev: boolean
}

// Authentication Types
export interface User {
    id: number
    clerkId: string
    email: string
    name?: string
    avatar?: string
    createdAt: Date
    updatedAt: Date
}

export interface AuthUser {
    userId: string
    sessionId: string
}

// Database Types
export interface Artifact {
    id: number
    userId: number
    content: string
    role: 'user' | 'assistant'
    createdAt: Date
    updatedAt: Date
}

export interface Prompt {
    id: number
    userId: number
    name: string
    description: string
    createdAt: Date
    updatedAt: Date
    versions: PromptVersion[]
}

export interface PromptVersion {
    id: number
    promptId: number
    version: number
    content: string
    createdAt: Date
}

// Image Generator Types
export interface GenerationRequest {
    id: string
    prompt: string
    negativePrompt?: string
    status: 'queued' | 'processing' | 'completed' | 'failed'
    createdAt?: Date
    completedAt?: Date
    imageUrl?: string
    error?: string
}

export interface QueueState {
    queue: GenerationRequest[]
    processing: GenerationRequest[]
    activeWorkers: number
    maxWorkers: number
}

export interface ApiProvider {
    id: string
    name: string
    status: 'online' | 'offline' | 'maintenance'
    capacity: number
    currentLoad: number
    responseTime: number
}

// Language Converter Types
export interface ConversionResult {
    success: boolean
    data?: string
    error?: string
}

export interface TranslationRequest {
    text: string
    fromLang: string
    toLang: string
}

export interface JapaneseConversionRequest {
    text: string
    fromType: 'hiragana' | 'katakana' | 'kanji' | 'romaji'
    toType: 'hiragana' | 'katakana' | 'kanji' | 'romaji'
}

export interface ConversionHistoryItem {
    id: string
    input: string
    output: string
    from: string
    to: string
    mode: 'translation' | 'japaneseConversion'
    timestamp: Date
}

export interface ConversionStats {
    totalConversions: number
    translationCount: number
    japaneseCount: number
}

// Typing Practice Types
export interface TypingStats {
    wpm: number
    accuracy: number
    mistakes: number
    timeElapsed: number
    charactersTyped: number
}

export interface TypingGameConfig {
    text: string
    timeLimit?: number
    difficulty: 'easy' | 'medium' | 'hard'
}

// UI Component Types
export interface AppCardProps {
    name: string
    description: string
    path: string
    icon: React.ComponentType<{ className?: string }>
    color: string
}

export interface ToastProps {
    title: string
    description?: string
    variant?: 'default' | 'destructive' | 'success'
    duration?: number
}

// Form Types
export interface FormField {
    name: string
    label: string
    type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox'
    required?: boolean
    placeholder?: string
    options?: Array<{ value: string; label: string }>
    validation?: {
        min?: number
        max?: number
        pattern?: RegExp
        custom?: (value: string) => boolean | string
    }
}

export interface FormState<T> {
    data: T
    errors: Partial<Record<keyof T, string>>
    touched: Partial<Record<keyof T, boolean>>
    isValid: boolean
    isSubmitting: boolean
}

// Error Handling Types
export interface AppError {
    message: string
    code: string
    statusCode: number
    details?: unknown
    stack?: string
}

export interface ErrorResponse {
    success: false
    error: {
        message: string
        code: string
        statusCode: number
        details?: unknown
    }
}

// Hook Types
export interface UsePollingOptions<T> {
    fn: () => Promise<T>
    interval: number
    enabled?: boolean
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
    immediate?: boolean
}

export interface UsePollingResult<T> {
    data: T | null
    loading: boolean
    error: Error | null
    start: () => void
    stop: () => void
    refetch: () => Promise<void>
}

// Utility Types
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Event Handler Types
export type EventHandler<T = unknown> = (event: T) => void
export type AsyncEventHandler<T = unknown> = (event: T) => Promise<void>

// Component Props Types
export interface BaseComponentProps {
    className?: string
    children?: React.ReactNode
    id?: string
    'data-testid'?: string
}

export interface LoadingState {
    isLoading: boolean
    error?: string | null
}

// API Route Types
export interface ApiRouteContext {
    params: Record<string, string>
    searchParams: Record<string, string | string[] | undefined>
    headers: Headers
}

// Cache Types
export interface CacheOptions {
    revalidate?: number
    tags?: string[]
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system'
export type ColorScheme = 'default' | 'blue' | 'green' | 'purple' | 'orange'

// Language Types
export type SupportedLanguage = 'en' | 'ja' | 'zh' | 'es' | 'fr' | 'de'
export type UiLanguage = 'en' | 'ja' | 'zh'

// File Upload Types
export interface FileUpload {
    file: File
    preview: string
    progress: number
    status: 'uploading' | 'completed' | 'error'
    error?: string
}

// Search and Filter Types
export interface SearchFilters {
    query?: string
    category?: string
    dateRange?: {
        start: Date
        end: Date
    }
    sortBy?: 'date' | 'name' | 'relevance'
    sortOrder?: 'asc' | 'desc'
    limit?: number
    offset?: number
}

export interface SearchResult<T> {
    items: T[]
    total: number
    facets?: Record<string, Array<{ value: string; count: number }>>
}
