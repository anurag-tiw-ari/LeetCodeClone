
import express from "express"
import userMidddleware from "../middleware/userMiddleware.js";
import { runCode, submitCode } from "../controllers/userSubmission.js";

const submitRouter = express.Router();

submitRouter.post('/submit/:id',userMidddleware,submitCode);

submitRouter.post('/run/:id',userMidddleware,runCode);

export default submitRouter;

