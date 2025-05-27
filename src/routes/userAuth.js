import express from "express";
import { register,login,logout,adminRegister } from "../controllers/userAuthentication.js";
import userMidddleware from "../middleware/userMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const authRouter=express.Router();

//  Register

authRouter.post('/register',register)

// Register Admin

authRouter.post('/admin/register',adminMiddleware,adminRegister)

//Login

authRouter.post('/login',login)


//LogOut

authRouter.post('/logout',userMidddleware,logout)

//GetProfile

//authRouter.get('/getProfile',getProfile)

export default authRouter