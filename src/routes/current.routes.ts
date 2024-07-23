import { Router } from "express";
import authenticateToken from "../middlewares/authenticateToken";
import CurrentUser from "../controllers/currentuser.controller";

const currentUserRouter = Router();

currentUserRouter.get('/', authenticateToken, CurrentUser.currentUser);
export default currentUserRouter;