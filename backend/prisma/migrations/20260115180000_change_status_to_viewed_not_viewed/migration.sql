-- AlterEnum: Change ApplicationStatus enum values
-- Drop old enum values and add new ones

-- Step 1: Create new enum type
CREATE TYPE "ApplicationStatus_new" AS ENUM ('NOT_VIEWED', 'VIEWED');

-- Step 2: Update existing data to new values
-- Map PENDING -> NOT_VIEWED, ACCEPTED -> VIEWED, REJECTED -> VIEWED
UPDATE "Application" 
SET status = CASE 
    WHEN status::text = 'PENDING' THEN 'NOT_VIEWED'::text
    WHEN status::text = 'ACCEPTED' THEN 'VIEWED'::text
    WHEN status::text = 'REJECTED' THEN 'VIEWED'::text
    ELSE status::text
END::text;

-- Step 3: Alter column to use new enum (temp text conversion)
ALTER TABLE "Application" ALTER COLUMN "status" TYPE text;

-- Step 4: Drop old enum
DROP TYPE "ApplicationStatus";

-- Step 5: Rename new enum to original name
ALTER TYPE "ApplicationStatus_new" RENAME TO "ApplicationStatus";

-- Step 6: Convert column back to enum
ALTER TABLE "Application" ALTER COLUMN "status" TYPE "ApplicationStatus" USING status::text::"ApplicationStatus";

-- Step 7: Set default value
ALTER TABLE "Application" ALTER COLUMN "status" SET DEFAULT 'NOT_VIEWED'::"ApplicationStatus";
