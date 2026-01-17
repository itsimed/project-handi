-- AlterEnum: Change ApplicationStatus enum values
-- Drop old enum values and add new ones

CREATE TYPE "ApplicationStatus_new" AS ENUM ('NOT_VIEWED', 'VIEWED');

-- Step 2: Drop existing default to remove dependency on old enum
ALTER TABLE "Application" ALTER COLUMN "status" DROP DEFAULT;

-- Step 3: Convert column to text first
ALTER TABLE "Application" ALTER COLUMN "status" TYPE text;

-- Step 4: Update existing data to new values
-- Map PENDING -> NOT_VIEWED, ACCEPTED -> VIEWED, REJECTED -> VIEWED
UPDATE "Application" 
SET status = CASE 
    WHEN status = 'PENDING' THEN 'NOT_VIEWED'
    WHEN status = 'ACCEPTED' THEN 'VIEWED'
    WHEN status = 'REJECTED' THEN 'VIEWED'
    ELSE 'NOT_VIEWED'
END;

-- Step 5: Drop old enum
DROP TYPE "ApplicationStatus";

-- Step 6: Rename new enum to original name
ALTER TYPE "ApplicationStatus_new" RENAME TO "ApplicationStatus";

-- Step 7: Convert column back to enum
ALTER TABLE "Application" ALTER COLUMN "status" TYPE "ApplicationStatus" USING status::"ApplicationStatus";

-- Step 8: Restore default value
ALTER TABLE "Application" ALTER COLUMN "status" SET DEFAULT 'NOT_VIEWED'::"ApplicationStatus";
