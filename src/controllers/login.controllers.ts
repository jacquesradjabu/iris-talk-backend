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
import jwt from 'jsonwebtoken';
import { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import client from "../client";
import isValidInput from '../utils/isValidInput';
import isValidPassword from '../utils/isValidPassword';
/**
 * @public 
 * LOGIN MODEL
 */
const user = client.user;
export default class LoginModel {
   /**
    * @public
    * LOGIN LOGIC & FUNCTIONALLITY
    * @param req any | object
    * @param res any | object
    */
   static async login(req: Request, res: Response): Promise<void> {
      try {
         const { password, name } = req.body;
         /**
          * valid email address and password
          * warning: it is crucial to get valid input
          */
         const validName = isValidInput(name);
         const validPassword = isValidPassword(password);
         if (!validName) {
            res.status(400).json({ message: 'Enter a name' });
            return;
         }
         if (!validPassword) {
            res.status(400).json({ message: 'The password must be at least 6 characters long, must contain at least one letter, must contain at least one number and must not be an empty string' });
            return;
         }
         // verify whether the user exist
         const allUsers = await user.findMany();
         
         const validUser = allUsers.find(function (targetUser) {
            return targetUser.name == name;
         });
         if (!validUser) {
            res.status(404).json({ error: 'user does not exist! Go to register screen!' });
            return;
         }

         // check password

         const authUser = await bcrypt.compare(password, validUser?.password || '');
         
         if (!authUser) {
            res.status(403).json({ error: 'wrong password' });
            return;
         }

         const token = jwt.sign({ currentUser: validUser }, "JSONWEBTOKEN", { expiresIn: '348h' });
         res.status(200).json({ message: `welcome ${validUser.name}! you are login`, token })
      } catch (error: any) {
         res.status(500).json({ message: error.message });
      }
   }
}