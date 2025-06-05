
//Create
//Fetch
//Update
//Delete

import express from "express";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblems,solvedProblemsByUser} from "../controllers/userProblem.js";
import userMidddleware from "../middleware/userMiddleware.js";

const problemRouter = express.Router();


//Create

problemRouter.post("/create",adminMiddleware,createProblem)

//Fetch

problemRouter.get("/getProblemById/:id",userMidddleware,getProblemById)

//Fetch all Problems

problemRouter.get("/getAllProblem",userMidddleware,getAllProblems)

//Update

problemRouter.put("/update/:id",adminMiddleware,updateProblem)

//Delete

problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem)


//Problems Solved By Particular User

problemRouter.get("/user",userMidddleware,solvedProblemsByUser)

export default problemRouter