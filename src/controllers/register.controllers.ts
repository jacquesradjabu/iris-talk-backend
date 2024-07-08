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
import bcrypt from 'bcrypt';
import isValidEmail from '../helpers/isValidEmail';
import isValidInput from '../helpers/isValidInput';
import isValidPassword from '../helpers/isValidPassword';
import client from '../client';
import { Response, Request } from 'express';
const user = client.user;
/**
 * @public
 * REGISTER MODEL LOGIC
 */
export default class RegisterModel {
   /**
    * @public
    * create new user function
    * @param req object | any 
    * @param res object | any 
    * @returns { Promise<void> }
    */
   static async register(req: Request, res: Response): Promise<void> {
      /*
      ===================================================================================
      CREATE A NEW USER | REGISTER USER
      ===================================================================================
      */
      try {
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
         /**
          * hash password in order to store it in the data
          * warning: Don't store plain text into a database
          */
         const hashPassword = await bcrypt.hash(password, 10);
         const createdUser = await user.create({
            data: { email, password: hashPassword, name },
         });
         if (!createdUser) {
            res.status(403).json({ message: 'oops something went wrong can not create' });
            return;
         }
         res.status(200).json({ message: `${createdUser.name} created successfully` });
      } catch (error: any) {
         res.status(500).json({ error: error.message });
      } finally {
         await client.$disconnect();
      }
   }
}