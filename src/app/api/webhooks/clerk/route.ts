import type { WebhookEvent } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { users } from "@/db/schema";
import { getDb } from "@/db/helpers";
import { formatErrorResponse } from "@/lib/error-handling";

function extractUserInfo(data: unknown) {
  const d = data as Record<string, unknown>;
  const id = d.id as string | undefined;
  if (!id) throw new Error("Missing user ID");

  const emailAddresses =
    (d.email_addresses as Array<{ email_address: string }> | undefined) ?? [];
  const firstName = (d.first_name as string) ?? "";
  const lastName = (d.last_name as string) ?? "";

  const email = emailAddresses[0]?.email_address;
  const primaryEmail = email || `${id}@no-email.clerk`;
  const name = `${firstName} ${lastName}`.trim() || "User";
  return { id, primaryEmail, name };
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("[ClerkWebhook] CLERK_WEBHOOK_SECRET is not set");
    return Response.json(
      formatErrorResponse(new Error("Webhook secret not configured")),
      { status: 500 },
    );
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return Response.json(
      formatErrorResponse(new Error("Missing svix headers")),
      { status: 400 },
    );
  }

  const payload = await req.text();

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("[ClerkWebhook] Error verifying webhook:", err);
    return Response.json(
      formatErrorResponse(new Error("Webhook verification failed")),
      { status: 400 },
    );
  }

  const eventType = evt.type;

  try {
    const db = await getDb();

    if (eventType === "user.created") {
      const { id, primaryEmail, name } = extractUserInfo(evt.data);

      await db.insert(users).values({
        clerkId: id,
        email: primaryEmail,
        name,
      });

      return Response.json(
        { success: true, data: { message: "User created" } },
        { status: 201 },
      );
    }

    if (eventType === "user.updated") {
      const { id, primaryEmail, name } = extractUserInfo(evt.data);

      await db
        .update(users)
        .set({
          email: primaryEmail,
          name,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, id));

      return Response.json(
        { success: true, data: { message: "User updated" } },
        { status: 200 },
      );
    }

    if (eventType === "user.deleted") {
      const d = evt.data as unknown as Record<string, unknown>;
      const id = d.id as string | undefined;

      if (!id) {
        return Response.json(
          formatErrorResponse(new Error("User deleted event missing ID")),
          { status: 400 },
        );
      }

      await db
        .update(users)
        .set({ deletedAt: new Date() })
        .where(eq(users.clerkId, id));

      return Response.json(
        { success: true, data: { message: "User deleted" } },
        { status: 200 },
      );
    }

    return Response.json(
      { success: true, data: { message: "Unhandled event type" } },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      `[ClerkWebhook] Database error for event ${eventType}:`,
      error,
    );
    return Response.json(formatErrorResponse(error), { status: 500 });
  }
}
