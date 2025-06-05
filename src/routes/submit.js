
import express from "express"
import userMidddleware from "../middleware/userMiddleware.js";
import { submitCode } from "../controllers/userSubmission.js";

const submitRouter = express.Router();

submitRouter.post('/submit/:id',userMidddleware,submitCode);

export default submitRouter;

