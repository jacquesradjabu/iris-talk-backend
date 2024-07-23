import { Router } from "express";
import UserController from "../controllers/user.controller";
import AuthController from "../controllers/auth.controller";


const router = Router();

router.route('/api/users/query?')
   .get(UserController.search);

router.route('/api/users')
   .get(UserController.list)
   .post(UserController.create);


// router.route('/api/users/:userId')
//    .get([UserController.read])
//    // .get([AuthController.requireSignin, UserController.read])
//    .put([AuthController.requireSignin, AuthController.hasAuthorization, UserController.update])
//    .delete([AuthController.requireSignin, AuthController.hasAuthorization, UserController.remove]);

router.param('userId', UserController.userById);

router.route('/api/users/:userId')
   .get(UserController.read)
   .put(UserController.update)
   .delete(UserController.remove);

export default router;