-- DropForeignKey
ALTER TABLE "CreatedUser" DROP CONSTRAINT "CreatedUser_createdById_fkey";

-- DropForeignKey
ALTER TABLE "CreatedUser" DROP CONSTRAINT "CreatedUser_userId_fkey";

-- AddForeignKey
ALTER TABLE "CreatedUser" ADD CONSTRAINT "CreatedUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatedUser" ADD CONSTRAINT "CreatedUser_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
