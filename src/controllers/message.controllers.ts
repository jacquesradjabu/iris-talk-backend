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
import client from '../client';
import getUser from '../helpers/getUser';
import isValidInput from '../helpers/isValidInput';
import { Response, Request } from 'express';
const messages = client.message;
const user = client.user;
/**
 * @public
 * MESSAGE MODEL LOGIC
 */
export default class MessageModel {
   /**
    * @public
    * GET ALL MESSAGES
    * @param req any | { } | empty object
    * @param res any | { } | empty object
    */
   static async getAllMessages(req: Request, res: Response): Promise<void> {
      try {
         const allMessages = await messages.findMany();
         if (!allMessages || allMessages.length == 0) {
            res.status(403).json({ message: 'empty' });
            return;
         }
         res.status(200).json(allMessages);
      } catch (error: any) {
         res.status(500).json({ message: error.message });
      } finally {
         await client.$disconnect();
      }
   }
   /**
    * @public
    * GET MESSAGE BY ID
    * @param req any | { } | empty object
    * @param res any | { } | empty object
    */
   static async getMessageById(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params;
         const findMessage = await messages.findFirst({ where: { id } });
         if (!findMessage) {
            res.status(403).json({ message: 'empty' });
            return;
         }
         res.status(200).json(findMessage);
      } catch (error: any) {
         res.status(500).json({ message: error.message });
      } finally {
         await client.$disconnect();
      }
   }
   /**
    * @public
    * CREATE MESSAGE
    */
   static async createMessage(req: Request, res: Response): Promise<void> {
      try {
         const { content, authorId } = req.body;
         const verifyContent = isValidInput(content);
         if (!verifyContent) {
            res.status(403).send('cannot send empty message');
            return;
         }
         const author = await getUser(authorId);
         const createMessage = await messages.create({ data: { content, authorId, author } });
         res.status(200).json(`message sent at ${createMessage.createdAt}`);
      } catch (error: any) {
         res.status(500).json({ message: error.message });
      } finally {
         await client.$disconnect();
      }
   }
   /**
    * @public
    * DELETE MESSAGE BY ID
    */
   static async deleteMessageById(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params;
         if (!id) {
            res.status(403).json({ error: 'this message does not exit' });
            return;
         }
         const deletedMessage = await messages.delete({ where: { id } });
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
   /**
    * @public
    * UPDATE MESSAGE BY ID
    */
   static async updateMessageById(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params;
         const { content } = req.body;
         if (!id) {
            res.send('you cannot edit this message');
            return;
         }
         const updatedMessage = messages.update({
            where: { id: id },
            data: { content: content }
         });
         if (!updatedMessage) {
            res.status(403).send('oops something went wrong! Please try again later');
            return;
         }
         res.status(200).json({ message: 'edited sucessfully', modif: (await updatedMessage).content });
      } catch (error: any) {
         res.status(500).json({ message: error.message });
      } finally {
         await client.$disconnect();
      }
   }

   /**
    * @public
    * GET MESSAGE BY AUTHOR ID | future functionnality
    */
   static async getMessageByAuthorId(req: Request, res: Response): Promise<void> {
      try {
         const { authorId } = req.params;
         // console.log(authorId);
         res.send(authorId);
      } catch (error: any) {
         res.status(500).json({ error: error.message });
      }
   }
}