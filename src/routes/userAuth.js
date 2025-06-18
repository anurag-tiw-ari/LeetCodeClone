import express from "express";
import { register,login,logout,adminRegister,deleteProfile,getProfile,heatMap,startFollow, startUnFollow, allFollowers, allFollowing, isFollowing,removeFollower } from "../controllers/userAuthentication.js";
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

//DeleteProfile

authRouter.delete('/deleteprofile',userMidddleware,deleteProfile)


authRouter.get('/check',userMidddleware,(req,res)=>{
    const reply = {
        firstName:req.result.firstName,
        emailId:req.result.emailId,
        _id:req.result._id,
        role:req.result.role
    }

    res.status(200).json({
        user:reply,
        message:"Valid User"
    })
})

//GetProfile

authRouter.get('/getProfile/:id',userMidddleware,getProfile)

//HeatMap

authRouter.post('/heatMap/:id',userMidddleware,heatMap)

//start follow

authRouter.post('/startfollow/:id',userMidddleware,startFollow)

authRouter.post('/startunfollow/:id',userMidddleware,startUnFollow)

authRouter.get('/allfollowers',userMidddleware,allFollowers)

authRouter.get('/allfollowing',userMidddleware,allFollowing)

authRouter.get('/isfollowing/:id',userMidddleware,isFollowing)

authRouter.get('/removefollower/:id',userMidddleware,removeFollower)

export default authRouter