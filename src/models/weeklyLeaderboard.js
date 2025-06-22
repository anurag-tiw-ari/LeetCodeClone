
import mongoose from "mongoose";
import { Schema } from "mongoose";

const weeklyLeaderboardSchema = new Schema({

    userId:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },

    weeklyCoinsEarned:{
        type:Number,
        default:0
    },
    weekStart:{
        type:Date
    }

})

const WeeklyLeaderboard = mongoose.model('weeklyleaderboard',weeklyLeaderboardSchema)

export default WeeklyLeaderboard