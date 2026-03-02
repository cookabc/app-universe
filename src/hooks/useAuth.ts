import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { cache } from 'react'
import { users } from '@/db/schema'

async function getDb() {
    const { db } = await import('@/db')
    return db
}

async function requireAuth() {
    const { userId } = await auth()

    if (!userId) {
        throw new Error('User not authenticated')
    }

    return userId
}

export const getUserWithAuth = cache(async function getUserWithAuth() {
    const userId = await requireAuth()
    const db = await getDb()

    const user = await db.query.users.findFirst({
        where: eq(users.clerkId, userId),
    })

    if (!user) {
        throw new Error('User not found')
    }

    return user
})
