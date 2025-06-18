import express from "express";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { generateImageUploadSignature } from "../controllers/contentImgSection.js";

const imageRouter = express.Router();

imageRouter.get("/create",adminMiddleware,generateImageUploadSignature);
// videoRouter.post("/save",adminMiddleware,saveVideoMetadata);
// videoRouter.delete("/delete/:problemId",adminMiddleware,deleteVideo);

export default imageRouter;