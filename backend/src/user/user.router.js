import { Router } from "express";
import { createUser, login, sendEmail,forgotPassword} from "./user.controller.js";
import { AdminUserGuard } from "../middleware/guard.middleware.js";


const userRouter = Router();

userRouter.post("/signup", createUser);
userRouter.post("/login", login);
userRouter.post("/send-mail", sendEmail);
userRouter.post("/forgot-password", forgotPassword);
userRouter.get("/session", AdminUserGuard,(req,res)=>{
    return res.json({message:"success"});
});

export default userRouter;
