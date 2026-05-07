export async function getDb() {
  const { db } = await import("@/db");
  return db;
}
