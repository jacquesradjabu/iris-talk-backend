import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mainConfig from '../config/config';



export default async function authenticateToken(
   req: Request | any,
   res: Response,
   next: NextFunction,
) {
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];

   if (token == null) {
      res.sendStatus(401);
   }

   try {
      const user = jwt.verify(token, mainConfig.jwtSecret);
      req.user = user;
      next();
   } catch (err) {
      res.sendStatus(403);
   }
};