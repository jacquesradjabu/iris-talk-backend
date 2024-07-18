import { Router } from "express";
import MessageController from "../controllers/message.controller";
import AuthController from "../controllers/auth.controller";

const router = Router();

router.route('/api/messages')
   .get([AuthController.requireSignin, MessageController.list])
   .post([AuthController.requireSignin, MessageController.create]);

router.route('/api/messages/:messageId')
   .get([AuthController.requireSignin, MessageController.read])
   .put([AuthController.requireSignin, AuthController.hasAuthorization, MessageController.update])
   .delete([AuthController.requireSignin, AuthController.hasAuthorization, MessageController.remove]);

router.param('messageId', MessageController.messageById);

export default router;