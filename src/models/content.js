import mongoose from "mongoose";

import { Schema } from "mongoose";

const contentSchema = new Schema( {
    topic:{
        type:String,
        rqeuired:true,
        enum:['Array','LinkedList','Binary Tree','Binary Search Tree', 'Recursion', 'Graph','Heap','Stack','Queue']
    },
    content:{
        type:String,
        reuired:true
    },
    title:{
        type:String,
        required:true,
    },
    ContentCreator:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    }
},
{
    timestamps:true
}
)

const Content = mongoose.model('content',contentSchema)

export default Content;