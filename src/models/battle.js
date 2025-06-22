

import mongoose from 'mongoose';
import { Schema } from 'mongoose';
const battleSchema = new Schema({
  player1: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user' 
},
  player2: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user' 
},
  difficulty: String,
  topics: [String],
  problem: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'problem' 
},
  winner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
}
},{
    timestamps:true
});

const Battle = mongoose.model('battle', battleSchema);

export default Battle;
