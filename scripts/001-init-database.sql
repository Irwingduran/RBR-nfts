-- This script will create the initial database schema
-- Run this after setting up your DATABASE_URL in environment variables

-- Note: Prisma will handle the schema creation
-- This is just for reference and manual setup if needed

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The actual tables will be created by Prisma Migrate
-- Run: npx prisma migrate dev --name init
