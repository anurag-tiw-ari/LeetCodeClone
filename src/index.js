import express from "express"
import dotenv from "dotenv"
dotenv.config();
import main from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/userAuth.js";
import redisClient from "./config/redis.js";
import problemRouter from "./routes/problemCreator.js";
import submitRouter from "./routes/submit.js";
import cors from "cors";
import aiRouter from "./routes/aiChatting.js";
import User from "./models/user.js";

const app=express()

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/user",authRouter)
app.use("/problem",problemRouter)
app.use("/submission",submitRouter)
app.use('/ai',aiRouter);


const InitializeConnection= async()=>{

    try{
          
        await Promise.all([main(),redisClient.connect()])
        console.log("Connected to DB")

        app.listen(process.env.PORT,()=>{
    
            console.log("Server is listening at port 3000")
         })
    }
    catch(err)
    {
        console.log("Error Not Connected to DB "+err)
    }
}


InitializeConnection();