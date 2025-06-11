import express from "express"
import userMidddleware from "../middleware/userMiddleware.js";
import solveDoubt from "../controllers/solveDoubt.js";


const aiRouter = express.Router()


aiRouter.post('/chat', userMidddleware, solveDoubt);

export default aiRouter;

