
//Create
//Fetch
//Update
//Delete

import express from "express";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblems,solvedProblemsByUser,submittedProblem,likedProblems,checkLike, getLikedProblemsByUser, problemsCreatedByAdmin} from "../controllers/userProblem.js";
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

problemRouter.get("/solvedProblemsByUser",userMidddleware,solvedProblemsByUser)

//Submitted Code by particular user for a particular problem

problemRouter.get("/submittedProblem/:id",userMidddleware,submittedProblem)

problemRouter.get("/likedProblem/:id",userMidddleware,likedProblems)

problemRouter.get("/checkLike/:id",userMidddleware,checkLike)

problemRouter.get("/likedProblemsByUser",userMidddleware,getLikedProblemsByUser)

problemRouter.get("/problemCreatedByAdmin",adminMiddleware, problemsCreatedByAdmin)

export default problemRouter