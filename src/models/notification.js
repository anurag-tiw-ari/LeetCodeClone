import mongoose from "mongoose"
import { Schema } from "mongoose";

const notificationSchema = new Schema({
    userId: 
    { 
        type: Schema.Types.ObjectId, 
        ref: 'user', 
        required: true 
    },  // receiver of notification
    message: 
    { 
        type: String, 
        required: true 
    },
    isRead: 
    { 
        type: Boolean, 
        default: false 
    },
    contentId:
    {
        type: Schema.Types.ObjectId, 
        ref: 'content', 
        required: true 
    },
    commentId:
    {
        type: Schema.Types.ObjectId, 
        ref: 'contentcomment', 
        required: true 
    }
},
{
    timestamps:true
});

const Notification = mongoose.model('notification', notificationSchema);

export default Notification;
