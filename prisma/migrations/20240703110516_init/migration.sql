-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author_id" TEXT NOT NULL,
    "author" TEXT NOT NULL,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follower" (
    "id" TEXT NOT NULL,

    CONSTRAINT "follower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "following" (
    "id" TEXT NOT NULL,

    CONSTRAINT "following_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "message_author_id_key" ON "message"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "follower_id_key" ON "follower"("id");

-- CreateIndex
CREATE UNIQUE INDEX "following_id_key" ON "following"("id");

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follower" ADD CONSTRAINT "follower_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "following_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
