const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
ObjectId       = Schema.ObjectId; 

const dataSchema = new mongoose.Schema({ 
    name: { type: String, required: true },
    status: { type: String, required: true },
    image: [],
    gmail_user: { type: String, required: true },
    gmail_password: { type: String, required: true },
    qrcode_image: { type: String, required: false },
    qrcode_url: { type: String, required: false },
    info: { type: String, required: false },
    isDeleted: { type: Boolean, default: false },  
    created_at: {type: Date,required: true,default: Date.now,},
    updated_at: {type: Date,required: true,default: Date.now,},
    
});  

module.exports = mongoose.model("config", dataSchema);