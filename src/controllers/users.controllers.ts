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
import isValidEmail from '../helpers/isValidEmail';
import isValidInput from '../helpers/isValidInput';
import isValidPassword from '../helpers/isValidPassword';
import { Request, Response } from 'express';

const user = client.user;
/**
 * @public
 * USER MODEL LOGIC
 */
export default class UserModel {
   /*
   ===================================================================================
   GET ALL USERS
   ===================================================================================
   */
   static async getAllUsers(req: Request, res: Response): Promise<void> {
      try {
         const allUsers = await user.findMany();
         if (!allUsers) {
            res.status(403).json({ message: 'use valid user' });
            return;
         }
         res.status(200).json(allUsers);
      } catch (error: any) {
         res.status(500).json({ message: error.message });
      } finally {
         await client.$disconnect();
      }
   }

   /*
   ===================================================================================
   GET ALL USERS BY ID
   ===================================================================================
   */

   static async getUserById(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params;
         const allUsers = await user.findMany();
         const targetedUser = allUsers.find(function (userItem) {
            return userItem.id == id;
         });
         if (!targetedUser) {
            res.status(403).json({ message: 'user does not exit' });
            return;
         }
         res.status(200).json(targetedUser);
      } catch (error: any) {
         res.status(500).json({ error: error.message });
      } finally {
         await client.$disconnect();
      }
   }

   /*
   ===================================================================================
   UPDATE USER BY ID
   ===================================================================================
   */

   static async updateUserById(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params;
         const { email, password, name } = req.body;
         const validEmail = isValidEmail(email);
         const validName = isValidInput(name);
         const validPassword = isValidPassword(password);
         if (!validEmail) {
            res.status(400).json({ message: 'Invalid email adress' });
            return;
         }
         if (!validName) {
            res.status(400).json({ message: 'Enter a name' });
            return;
         }
         if (!validPassword) {
            res.status(400).json({ message: 'The password must be at least 6 characters long, must contain at least one letter, must contain at least one number and must not be an empty string' });
            return;
         }
         const updatedUser = await user.update({
            where: { id },
            data: { email, password, name }
         });
         if (!updatedUser) {
            res.status(403).json({ message: 'oops something went wrong! try again' });
            return;
         }
         res.status(200).json(updatedUser);
      } catch (error: any) {
         res.status(500).json({ error: error.message });
      } finally {
         await client.$disconnect();
      }
   }


   /*
   ===================================================================================
   DELETE USER BY ID
   ===================================================================================
   */

   static async deleteUserById(req: Request | any, res: Response): Promise<void> {
      try {
         const { currentUser } = req.user;
         const { id } = req.params;
         if (currentUser.id == id) {
            const deletedUser = await user.delete({ where: { id } });
            if (!deletedUser) {
               res.status(403).json({ message: 'oops something went wrong! try again' });
               return;
            }
         }
         res.status(200).json(`deleted succesfully`);
      } catch (error: any) {
         res.status(500).json({ error: 'unauthorized' });
      } finally {
         await client.$disconnect();
      }
   }
}