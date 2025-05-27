import express from "express";
import { register,login,logout } from "../controllers/userAuthentication.js";
import userMidddleware from "../middleware/userMiddleware.js";

const authRouter=express.Router();

//  Register

authRouter.post('/register',register)

//Login

authRouter.post('/login',login)

//LogOut

authRouter.post('/logout',userMidddleware,logout)

//GetProfile

//authRouter.get('/getProfile',getProfile)

export default authRouter