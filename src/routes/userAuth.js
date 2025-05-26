import express from "express";

const authRouter=express.Router();

//  Register

authRouter.post('/register',register)

//Login

authRouter.post('/login',login)

//LogOut

authRouter.post('/login',logout)

//GetProfile

authRouter.get('/getProfile',getProfile)