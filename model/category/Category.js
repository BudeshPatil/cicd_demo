const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
ObjectId       = Schema.ObjectId; 

const dataSchema = new mongoose.Schema({ 
    name: { type: String, required: true },
    status: { type: String, required: true },
    description :{ type: String, required: true }, 
    meta_description : { type: String, required: true },
    meta_title: { type: String, required: true },
    meta_keywords : { type: String, required: true },
    user_id: {type: ObjectId},
    image: { type: String},
    isDeleted: { type: Boolean, default: false },  
    isApproved: { type: Boolean, default: false },  
    created_at: {type: Date,required: true,default: Date.now,},
    updated_at: {type: Date,required: true,default: Date.now,},
    
});  

module.exports = mongoose.model("category", dataSchema);