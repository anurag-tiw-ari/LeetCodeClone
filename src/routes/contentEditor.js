import express from "express";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { contentUpload,getAllContent,contentUpdate,contentDelete,getContentByTopic,getContentById,getContentByUser,getLatestContentByUser } from "../controllers/userContent.js";
import userMidddleware from "../middleware/userMiddleware.js";

const contentRouter = express.Router();


contentRouter.post('/upload',adminMiddleware,contentUpload)
contentRouter.put('/update/:contentId',adminMiddleware,contentUpdate)
contentRouter.delete('/delete/:contentId',adminMiddleware,contentDelete)
contentRouter.get('/allcontent',userMidddleware,getAllContent)
contentRouter.get('/contentbytopic/:topic',userMidddleware,getContentByTopic)
contentRouter.get('/contentbyId/:contentId',userMidddleware,getContentById)
contentRouter.get('/contentbyuser',userMidddleware,getContentByUser)
contentRouter.get('/latestcontentbyuser',userMidddleware,getLatestContentByUser)

export default contentRouter
