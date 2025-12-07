-- Sample event data for testing
-- This will be inserted after running Prisma migrations

INSERT INTO "Event" (id, name, description, date, location, "claimCode", "isActive", "maxSupply", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'Blockchain Conference 2024',
  'Annual blockchain and Web3 conference',
  '2024-06-15 10:00:00',
  'San Francisco, CA',
  'BLOCKCHAIN2024',
  true,
  1000,
  NOW(),
  NOW()
);

INSERT INTO "Event" (id, name, description, date, location, "claimCode", "isActive", "maxSupply", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'NFT Art Exhibition',
  'Exclusive NFT art showcase',
  '2024-07-20 18:00:00',
  'New York, NY',
  'NFTART2024',
  true,
  500,
  NOW(),
  NOW()
);
