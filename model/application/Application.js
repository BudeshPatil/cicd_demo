const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
ObjectId       = Schema.ObjectId; 
const AutoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate-v2')

const dataSchema = new mongoose.Schema({ 
    name: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, default: false },
    mobile :{ type: Number, required: true },
    education :{ type: String, required: true },
    dofb :{ type: Date, required: true },
    age :{ type: Number, required: true },
    occupation :{ type: String, required: true },
    adharNo :{ type: Number, required: true },
    address :{ type: String, required: true },
    place :{ type: String, required: true },
    hobli :{ type: String, required: true },
    district :{ type: String, required: true },
    taluk :{ type: String, required: true },
    pincode :{ type: String, required: true },
    image: { type: String},
    isDeleted: { type: Boolean, default: false },  
    isApproved: { type: String, required: false },
    application_num : { type: String, default: false },
    created_at: {type: Date,required: true,default: Date.now,},
    updated_at: {type: Date,required: true,default: Date.now,}
});  

dataSchema.plugin(mongoosePaginate)
AutoIncrement.initialize(mongoose.connection);
dataSchema.plugin(AutoIncrement.plugin, {
     model: 'application',
     field: 'sequence_number',
     startAt: 1,
     incrementBy: 1,
     type: String,
     unique: false
});

module.exports = mongoose.model("application", dataSchema);