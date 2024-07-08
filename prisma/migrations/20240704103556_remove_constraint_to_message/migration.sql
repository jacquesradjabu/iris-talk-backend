/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "message_author_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");
