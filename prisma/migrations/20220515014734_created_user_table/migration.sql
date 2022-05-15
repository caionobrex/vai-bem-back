-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdUsersCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "CreatedUser" (
    "userId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "CreatedUser_pkey" PRIMARY KEY ("userId","createdById")
);

-- AddForeignKey
ALTER TABLE "CreatedUser" ADD CONSTRAINT "CreatedUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatedUser" ADD CONSTRAINT "CreatedUser_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
