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


/**
 * @public
 * JSON WEB TOKEN VERIFY FUNCTION
 * @param req object | any
 * @param res object | any
 * @param next object | any
 */

export default function verifyToken(req: any, res: any, next: any): void {
   try {
      const token = req.headers.authorization.split(' ')[1];
      const user = jwt.verify(token, 'JSONWEBTOKEN');
      req.user = user;
      console.log(req.user);
      next();
   } catch (error: any) {
      res.status(500).json({ error: error.message });
   }
}