import { NextResponse } from 'next/server'
import { buildToolsJson } from '@/lib/markdown'

export const dynamic = 'force-static'

export function GET() {
    return new NextResponse(buildToolsJson(), {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
    })
}
