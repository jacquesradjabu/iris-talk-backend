-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_receiverId_fkey";

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
