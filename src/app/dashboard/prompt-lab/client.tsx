
'use client'

import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { ModuleList } from './components/module-list'

export default function PromptLabClient() {

    return (
        <AppErrorBoundary>
            <div>
                <h2 className="text-3xl font-bold mb-8">Prompt Lab</h2>
                <ModuleList />
            </div>
        </AppErrorBoundary>
    )
}
