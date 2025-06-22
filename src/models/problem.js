import mongoose from "mongoose";
import { Schema } from "mongoose";

const problemSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    difficulty:{
        type:String,
        enum:['easy','medium','hard'],
        required:true
    },
    tags:{
        type:String,
        enum:['Array','String','Recursion','Basic Programming','Star Pattern','Maths','LinkedList','Tree','Graph','DP','Stack','Queue'],
        required:true
    },
    visibleTestCases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true
            },
            explanation:{
                type:String,
                required:true
            }
        }
    ],
    hiddenVisibleTestCases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true
            }
        }
    ],
    startCode:[
        {
            language:{
                type:String,
                required:true,
            },
            initialCode:{
                type:String,
                required:true
            }
        }
    ],
    referenceSolution:[{
        language:{
            type:String,
            required:true,
        },
        completeCode:{
            type:String,
            required:true
        }
    }],
    potdDate:{
       type:Date,
       default:null
    },
    problemCreator:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    }
    
})


const Problem = mongoose.model('problem',problemSchema)

export default Problem;