import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { cache } from 'react'
import { db } from '@/db'
import { users } from '@/db/schema'

export async function getCurrentUser() {
    const { userId } = await auth()

    if (!userId) {
        throw new Error('User not authenticated')
    }

    const user = await db.query.users.findFirst({
        where: eq(users.clerkId, userId),
    })

    if (!user) {
        throw new Error('User not found')
    }

    return user
}

export async function requireAuth() {
    const { userId } = await auth()

    if (!userId) {
        throw new Error('User not authenticated')
    }

    return userId
}

export async function optionalAuth() {
    const { userId } = await auth()
    return userId
}

export const getUserWithAuth = cache(async function getUserWithAuth() {
    const userId = await requireAuth()

    const user = await db.query.users.findFirst({
        where: eq(users.clerkId, userId),
    })

    if (!user) {
        throw new Error('User not found')
    }

    return user
})
