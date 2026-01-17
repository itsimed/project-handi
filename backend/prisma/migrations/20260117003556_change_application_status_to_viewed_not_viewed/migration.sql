-- Step 1: Add new enum values first (before converting data)
ALTER TYPE "ApplicationStatus" ADD VALUE IF NOT EXISTS 'NOT_VIEWED';
ALTER TYPE "ApplicationStatus" ADD VALUE IF NOT EXISTS 'VIEWED';

-- Step 2: Convert existing data to new values using a temporary column
-- PENDING -> NOT_VIEWED (pas encore consulté)
-- ACCEPTED -> VIEWED (consulté)
-- REJECTED -> VIEWED (consulté)

-- Create a temporary column with text type
ALTER TABLE "Application" ADD COLUMN status_temp TEXT;

-- Convert old values to new values
UPDATE "Application" 
SET status_temp = CASE 
  WHEN status::text = 'PENDING' THEN 'NOT_VIEWED'
  WHEN status::text = 'ACCEPTED' THEN 'VIEWED'
  WHEN status::text = 'REJECTED' THEN 'VIEWED'
  ELSE 'NOT_VIEWED'
END;

-- Step 3: Remove old enum values by recreating the enum type
-- Note: PostgreSQL doesn't support removing enum values directly
-- We need to recreate the enum type

-- Create new enum type with only the values we want
CREATE TYPE "ApplicationStatus_new" AS ENUM ('VIEWED', 'NOT_VIEWED');

-- Drop the old column and recreate with new enum
ALTER TABLE "Application" DROP COLUMN status;
ALTER TABLE "Application" ADD COLUMN status "ApplicationStatus_new" NOT NULL DEFAULT 'NOT_VIEWED'::"ApplicationStatus_new";

-- Update the new column from the temporary column
UPDATE "Application" 
SET status = status_temp::"ApplicationStatus_new";

-- Drop the temporary column
ALTER TABLE "Application" DROP COLUMN status_temp;

-- Drop old enum and rename new one
DROP TYPE "ApplicationStatus";
ALTER TYPE "ApplicationStatus_new" RENAME TO "ApplicationStatus";
