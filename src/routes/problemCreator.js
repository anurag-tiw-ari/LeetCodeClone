
//Create
//Fetch
//Update
//Delete

import express from "express";
import adminMiddleware from "../middleware/adminMiddleware.js";
import createProblem from "../controllers/userProblem.js";

const problemRouter = express.Router();


//Create

problemRouter.post("/create",adminMiddleware,createProblem)

//Fetch

//problemRouter.get("/:id",getProblemById)

//Fetch all Problems

//problemRouter.get("/",getAllProblems)

//Update

//problemRouter.patch("/:id",adminMiddleware,updateProblem)

//Delete

//problemRouter.delete("/:id",adminMiddleware,deleteProblem)


//Problems Solved By Particular User

//problemRouter.get("/user",solvedProblemsByUser)

export default problemRouter