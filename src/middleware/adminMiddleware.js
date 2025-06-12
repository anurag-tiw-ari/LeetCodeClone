
import redisClient from "../config/redis.js"
import User from "../models/user.js"
import jwt from "jsonwebtoken"

const adminMiddleware=async(req,res,next)=>{
    try{

        const {token}=req.cookies

        if(!token)
            throw new Error("Token is not Present")

        const payload = jwt.verify(token,process.env.KEY)

        const {_id} = payload

        if(!_id)
            throw new Error("Invalid Token")

        const result = await User.findById(_id)

        if(!result)
            throw new Error("User Doesn't Exist")

        if(result.role!="admin")
            throw new Error("Invalid Token")

        // IS TOKEN PRESENT ON REDIS BLOCKLIST OR NOT

        const ISBLOCKED = await redisClient.exists(`token:${token}`)

        if(ISBLOCKED)
            throw new Error("INVALID TOKEN")

        req.result = result

        next();

    }
    catch(err)
    {
         res.status(400).send("Error:"+err.message)
    }
}

export default adminMiddleware;