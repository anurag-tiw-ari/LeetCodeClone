import mongoose from "mongoose";
import { Schema } from "mongoose";

const contentCommentSchema = new Schema(
    {
    contentId: 
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'content', 
        required: true 
    },
    userId: 
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user' 
    },
    content: 
    { 
        type: String, 
        required: true 
    },
    parentCommentId: 
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'contentcomment', 
        default: null 
    },
}, 
{ 
    timestamps: true 
});

const ContentComment = mongoose.model('contentcomment', contentCommentSchema);

export default ContentComment;
