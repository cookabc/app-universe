import { eq } from "drizzle-orm";
import { cache } from "react";
import { getDb } from "@/db/helpers";
import { users } from "@/db/schema";

async function requireAuth() {
  // Dynamic import to avoid build-time errors
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return userId;
}

export const getUserWithAuth = cache(async function getUserWithAuth() {
  const userId = await requireAuth();
  const db = await getDb();

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
});
