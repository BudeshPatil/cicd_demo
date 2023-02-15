const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
ObjectId       = Schema.ObjectId; 

const dataSchema = new mongoose.Schema({ 
    name: { type: String, required: true },
    status: { type: String, required: true },
    image: { type: Array},
    isDeleted: { type: Boolean, default: false },  
    isApproved: { type: Boolean, default: false },  
    created_at: {type: Date,required: true,default: Date.now,},
    updated_at: {type: Date,required: true,default: Date.now,},
    
});  

module.exports = mongoose.model("brand", dataSchema);