import { Request, Response } from 'express';
import userSchema from '../models/user.model';


export default class CurrentUser {
   static async currentUser(
      req: Request | any,
      res: Response
   ): Promise<void> {
      const { userId } = req.user;
      try {
         const user = await userSchema.findUnique({
            where: {
               userId
            },
            select: {
               userAvatarURL: true,
               userName: true,
               userEmail: true,
               userDescription: true,
               role: false,
               userPassword: false,
               created: true,
               updated: false,
            }
         });
         if (!user) {
            res.sendStatus(404);
            return;
         }
         res.json(user);
      } catch {
         res.sendStatus(400);
      }
   }
}