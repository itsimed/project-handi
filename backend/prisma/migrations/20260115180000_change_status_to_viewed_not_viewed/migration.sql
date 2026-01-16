-- AlterEnum: Change ApplicationStatus enum values
-- Drop old enum values and add new ones

-- Step 1: Create new enum type
CREATE TYPE "ApplicationStatus_new" AS ENUM ('NOT_VIEWED', 'VIEWED');

-- Step 2: Convert column to text first
ALTER TABLE "Application" ALTER COLUMN "status" TYPE text;

-- Step 3: Update existing data to new values
-- Map PENDING -> NOT_VIEWED, ACCEPTED -> VIEWED, REJECTED -> VIEWED
UPDATE "Application" 
SET status = CASE 
    WHEN status = 'PENDING' THEN 'NOT_VIEWED'
    WHEN status = 'ACCEPTED' THEN 'VIEWED'
    WHEN status = 'REJECTED' THEN 'VIEWED'
    ELSE 'NOT_VIEWED'
END;

-- Step 4: Drop old enum
DROP TYPE "ApplicationStatus";

-- Step 5: Rename new enum to original name
ALTER TYPE "ApplicationStatus_new" RENAME TO "ApplicationStatus";

-- Step 6: Convert column back to enum
ALTER TABLE "Application" ALTER COLUMN "status" TYPE "ApplicationStatus" USING status::"ApplicationStatus";
