import User from "../models/user.js"
import validate from "../utils/validator.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import redisClient from "../config/redis.js"
import Submission from "../models/submission.js"


const register=async (req,res)=>{

    try
    {

        //Validate the Data
        validate(req.body)
        
        const {firstName,emailId,password} =req.body

        const userExist = await User.find({emailId})

        if(userExist.length!=0)
        {
            throw new Error("User already Exist With this Email Id")
        }

        req.body.password = await bcrypt.hash(password,10)

        req.body.role="user";

        const user=await User.create(req.body)

        const token = jwt.sign({_id:user._id,emailId:emailId,role:'user'},process.env.KEY,{expiresIn:60*60})

        const reply = {
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id,
            role:user.role
           }

        res.cookie('token',token,{maxAge:60*60*1000})    //frontend

        res.status(201).json({
            user:reply,
            message:"LogedIn Successfully"
        })
         

    }
    catch(err){
        res.status(400).send("Error:"+err.message)
    }
}

const login=async(req,res)=>{
    try{
        const {emailId,password}=req.body

        if(!emailId)
        {
            throw new Error("Invalid Credentials")
        }
        if(!password)
        {
            throw new Error("Invalid Credentials")
        }
        
       const user = await User.findOne({emailId})

       if(!user)
        throw new Error("User Not Found")

       const ans = await bcrypt.compare(password,user.password)

       if(!ans)
        throw new Error("Invalid Credentials")

       const reply = {
        firstName:user.firstName,
        emailId:user.emailId,
        _id:user._id,
        role:user.role
       }

       const token = jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.KEY,{expiresIn:60*60})

        res.cookie('token',token,{maxAge:60*60*1000})   

        res.status(201).json({
            user:reply,
            message:"LogedIn Successfully"
        })
    }
    catch(err){
        res.status(401).send("Error:"+err)
    }
}

const logout = async(req,res)=>{

    try{

           const {token} = req.cookies;
 
           const payload = jwt.decode(token);

           await redisClient.set(`token:${token}`,"Blocked")

           await redisClient.expireAt(`token:${token}`,payload.exp)

           res.cookie("token",null,{expires: new Date(Date.now())})

           res.send("Logged Out SuccessFully")


    }
    catch(err){
        res.send("Error:"+err.message)
    }
}

const adminRegister= async (req,res)=>{
    try
    {

        //Validate the Data
        validate(req.body)
        
        const {firstName,emailId,password} =req.body

        req.body.password = await bcrypt.hash(password,10)

        const user=await User.create(req.body)

        const token = jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.KEY,{expiresIn:60*60})

        res.cookie('token',token,{maxAge:60*60*1000})   

        res.status(201).send("User Registrerd Sucessfully")
         

    }
    catch(err){
        res.status(400).send("Error:"+err)
    }
}

const deleteProfile = async (req,res)=>{
   try{
        const userId = req.result._id;

        if(!userId)
        {
            throw new Error("User Does Not Exist")
        }

        await  User.findByIdAndDelete(userId);

        await Submission.deleteMany({userId});

        res.status(200).send("Deleted Successfully");




   }
   catch(err)
   {
        res.status(400).send("Error:"+err);

   }
}




export {register,login,logout,adminRegister,deleteProfile}