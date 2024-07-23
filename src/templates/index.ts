// // Function to send a message
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export default async function sendMessage(senderId: string, receiverId: string, messageContent: string) {
//    const message = await prisma.message.create({
//      data: {
//        messageContent,
//        receiverId,
//        senderId,
//      },
//    });
//    return message;
//  }
// async function sendMessage(senderId: string, receiverId: string, messageContent: string) {
//    const message = await prisma.message.create({
//      data: {
//        messageContent,
//        receiverId,
//        senderId,
//      },
//    });
//    return message;
//  }

/**
 
async function getMessageById(messageId: string) {
  const message = await prisma.message.findUnique({
    where: { messageId },
    include: {
      sender: true,
      receiver: true,
    },
  });

 */