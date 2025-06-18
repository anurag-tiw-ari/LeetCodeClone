
import express from "express";
import userMidddleware from "../middleware/userMiddleware.js";
import { postContentComment,getContentComment,getCommentsNotification,readCommentNotification,deleteComment } from "../controllers/ContentComment.js";

const contentCommentRouter = express.Router();

contentCommentRouter.post('/postcomment',userMidddleware,postContentComment)

contentCommentRouter.get('/getcomments/:contentId',userMidddleware,getContentComment)

contentCommentRouter.get('/getnotification',userMidddleware,getCommentsNotification)

contentCommentRouter.get('/readnotification/:notificationId',userMidddleware,readCommentNotification)

contentCommentRouter.delete('/deletecomment/:commentId',userMidddleware,deleteComment)

export default contentCommentRouter;