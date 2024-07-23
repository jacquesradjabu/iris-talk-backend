/**
 * @license
 * Copyright 2024 Birusha Ndegeya, sofia and Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Response, Request, NextFunction } from 'express';
import messageSchema from '../models/message.model';
import client from '../client';
import isValidInput from '../utils/isValidInput';
export default class MessageController {
   /**
    * @public
    * create a new message
    */
   static async create(req: Request, res: Response): Promise<void> {
      const { messageContent, receiverId, senderId } = req.body;
      try {
         // check if those users exist
         const verifyContent = isValidInput(messageContent);
         if (!verifyContent) {
            res.status(403).send('cannot send empty message');
            return;
         }
         const sender = await client.user.findUnique({ where: { userId: senderId } });
         const receiver = await client.user.findUnique({ where: { userId: receiverId } });
         if (!sender || !receiver) {
            res.status(404).send('sender or receiver not found');
            return;
         }
         await messageSchema.create({
            data: {
               messageContent: messageContent,
               receiverId: receiverId,
               senderId: senderId
            }
         });
         res.status(201).json(`created successfully!`);
      } catch (error: any) {
         res.status(400).json({ message: error.message });
         return;
      } finally {
         await client.$disconnect();
         return;
      }
   }
   /**
    * @public
    * LIST ALL MESSAGES
    */
   static async list(_: Request, res: Response): Promise<void> {
      try {
         const allMessages = await messageSchema.findMany({
            include: {
               sender: {
                  select: {
                     userPassword: false,
                     userName: true,
                     userDescription: false,
                     userId: true,
                     userAvatarURL: true,
                     role: false,
                     created: true,
                     updated: false,
                     userEmail: true,
                  }
               },
               receiver: {
                  select: {
                     userName: true,
                     userPassword: false,
                     userDescription: false,
                     userId: true,
                     userAvatarURL: true,
                     role: false,
                     created: true,
                     updated: false,
                     userEmail: true,
                  }
               }
            }
         });
         if (!allMessages || allMessages.length == 0) {
            res.json({ message: 'empty' });
            return;
         }
         res.status(200).json(allMessages);
      } catch (error: any) {
         res.status(400).json({
            message: error.message
         });
         return;
      } finally {
         await client.$disconnect();
         return;
      }
   }

   /**
    * @public
    * listTalk
    * This function takes two string [senderId, receiverId] as arguments and returns a list of talk between two people 
    */
   static async listTalk(req: Request, res: Response): Promise<void> {
      try {
         const { senderId, receiverId } = req.body;
         const sender = await client.user.findUnique({ where: { userId: senderId } });
         const receiver = await client.user.findUnique({ where: { userId: receiverId } });
         if (!sender || !receiver) {
            res.status(404).send('sender or receiver not found');
            return;
         }
         const talkList = await messageSchema.findMany({
            where: {
               senderId: senderId,
               receiverId: receiverId
            },
            include: {
               sender: {
                  select: {
                     userPassword: false,
                     userName: true,
                     userDescription: false,
                     userId: true,
                     userAvatarURL: true,
                     role: false,
                     created: true,
                     updated: false,
                     userEmail: true,
                  }
               },
               receiver: {
                  select: {
                     userName: true,
                     userPassword: false,
                     userDescription: false,
                     userId: true,
                     userAvatarURL: true,
                     role: false,
                     created: true,
                     updated: false,
                     userEmail: true,
                  },
               },
            }
         })
         res.status(200).json(talkList);
      } catch (err) {
         res.status(400).json({
            message: 'Bad Request',
            error: err.message
         });
         return
      } finally {
         await client.$disconnect();
         return;
      }
   }

   /**
    * @public
    * MESSAGE BY ID | all routes should pass by here if the have messageId param
    */
   static async messageById(
      req: Request | any,
      res: Response,
      next: NextFunction,
      messageId: string
   ): Promise<void> {
      try {
         const message = await messageSchema.findUnique({
            where: {
               messageId: messageId
            },
            include: {
               sender: {
                  select: {
                     userPassword: false,
                     userName: true,
                     userDescription: false,
                     userId: true,
                     userAvatarURL: true,
                     role: false,
                     created: true,
                     updated: false,
                     userEmail: true,
                  },
               },
               receiver: {
                  select: {
                     userName: true,
                     userPassword: false,
                     userDescription: false,
                     userId: true,
                     userAvatarURL: true,
                     role: false,
                     created: true,
                     updated: false,
                     userEmail: true,
                  }
               },
            }
         });
         if (!message) {
            res.status(400).send("message does not exist");
            return;
         }
         req.currentMessage = message;
         next();
      } catch (error: any) {
         res.status(500).json({ message: error.message });
      } finally {
         await client.$disconnect();
      }
   }

   /**
    * @public
    * read a specific message
    */


   static async read(
      req: Request | any,
      res: Response
   ): Promise<void> {
      res.status(200).json(req.currentMessage);
   }


   /**
  * @public
  * update a specific message using its ID
  */

   static async update(
      req: Request | any,
      res: Response
   ): Promise<void> {
      try {
         const { messageContent } = req.body;
         let message = req.currentMessage;
         const messageId = message.messageId;
         await messageSchema.update({
            where: {
               messageId: messageId
            },
            data: {
               messageContent: messageContent,
               updated: new Date().toUTCString()
            }
         });
         res.send('Message edited!');
      } catch (error: any) {
         res.status(500).json({ message: error.message });
      } finally {
         await client.$disconnect();
      }
   }

   /**
    * @public
    * REMOVE MESSAGE BY ID
    */
   static async remove(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params;
         if (!id) {
            res.status(403).json({ error: 'this message does not exit' });
            return;
         }
         const deletedMessage = await messageSchema.delete({ where: { messageId: id } });
         if (!deletedMessage) {
            res.send('something went wrong! try again later!');
         }
         res.status(200).send('message deleted succesffully');
      } catch (error: any) {
         res.status(500).json({ message: error.message });
      } finally {
         await client.$disconnect();
      }
   }
}