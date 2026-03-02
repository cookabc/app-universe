-- Fix breaking migration: Add DEFAULT 'user' to role column so existing rows are not rejected
ALTER TABLE "artifacts" ALTER COLUMN "role" SET DEFAULT 'user';

-- Back-fill any rows that may have been inserted without a role value
UPDATE "artifacts" SET "role" = 'user' WHERE "role" IS NULL;
