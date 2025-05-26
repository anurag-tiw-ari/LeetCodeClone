import User from "../models/user.js"
import validate from "../utils/validator.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const register=async (req,res)=>{

    try
    {

        //Validate the Data
        validate(req.body)
        
        const {firstName,emailId,password} =req.body

        req.body.password = await bcrypt.hash(password,10)

        const user=await User.create(req.body)

        const token = jwt.sign({_id:user._id,emailId:emailId},process.env.KEY,{expiresIn:60*60})

        res.cookie('token',token,{maxAge:60*60*1000})    //frontend

        res.status(201).send("User Registrerd Sucessfully")
         

    }
    catch(err){
        res.status(400).send("Error:",err)
    }
}