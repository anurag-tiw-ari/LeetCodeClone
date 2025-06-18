import mongoose from "mongoose";
import { Schema } from "mongoose";

const imageSchema = new Schema({
    contentId: {
        type: Schema.Types.ObjectId,
        ref: 'content',
        required: true
    },
    userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
   },
   cloudinaryPublicId: {
    type: String,
    required: true,
    unique: true
  },
  secureUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  duration: {
    type: Number,
    required: true
  },
},{
    timestamps:true
});



const SolutionVideo = mongoose.model("solutionVideo",videoSchema);

export default SolutionVideo