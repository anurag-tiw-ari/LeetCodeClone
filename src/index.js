import express from "express"
import dotenv from "dotenv"
dotenv.config();
import main from "./config/db.js";

const app=express()

app.use(express.json())

main()
.then(async()=>{

    console.log("Connected to DB")
    app.listen(process.env.PORT,()=>{
    
        console.log("Server is listening at port 3000")
     })
})
.catch(err=>console.log("Error Not Connected to DB",err))