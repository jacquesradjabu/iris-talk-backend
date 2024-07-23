-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_receiverId_fkey";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "user_avatar_url" SET DEFAULT 'I am a mysterious who has yet to fill out my bio';

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
