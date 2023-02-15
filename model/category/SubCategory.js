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
    user_id: {type: ObjectId, required: true},
    cat_id: {type: ObjectId, required: true},
    image: { type: String},
    created_at: {type: Date,required: true,default: Date.now,},
    updated_at: {type: Date,required: true,default: Date.now,},
    isDeleted: { type: Boolean, default: false },  
});  

module.exports = mongoose.model("Subcategory", dataSchema);