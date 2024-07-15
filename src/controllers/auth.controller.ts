import { Request, Response, NextFunction } from "express";
import userSchema from "../models/user.model";
import jwt from 'jsonwebtoken';
// import expressJwt from 'express-jwt'; // warning should work in the browser with this dependancy I must install it tomorrow
import mainConfig from '../config/config';
import { authenticate } from "../models/user.model";


export default class AuthController {
   static async signin(req: Request, res: Response): Promise<void> {
      const { userEmail, userPassword } = req.body;
      try {
         const user = await userSchema.findUnique({
            where: {
               userEmail: userEmail
            }
         });
         if (!user) {
            res.status(401).json({ error: 'User not found!' });
            return;
         }
         if (!await authenticate(userPassword, user.userPassword)) {
            res.status(401).json({
               error: "Email and Password don't match"
            });
            return;
         }
         const token = jwt.sign({ userId: user.userId }, mainConfig.jwtSecret);
         // const delaisExpirationCookie = new Date().getMilliseconds() + 9999999; I cannot extend times as I want
         res.cookie('accesstoken', token, { expires: new Date() });
         // console.log(token);
         res.status(200).json({
            statusCode: 200,
            message: 'Login sucessfully',
            data: {
               accessToken: token,
               userId: user.userId,
               userName: user.userName,
               userEmail: user.userEmail,
            }
         });
      } catch (error: any) {
         console.log(error.stack);
         return;
      }
   }

   static signout(_: Request, res: Response) {
      res.clearCookie('accesstoken');
      res.status(200).json({
         message: 'signed out!'
      });
   }

   static requireSignin(_: Request, __: Response, next: NextFunction) {
      console.log('require signin');
      next();
   }

   static hasAuthorization(_: Request, __: Response, next: NextFunction) {
      console.log('has authorization');
      next();
   }
}