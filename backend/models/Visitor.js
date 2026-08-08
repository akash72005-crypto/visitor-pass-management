const mongoose = require("mongoose");


const visitorSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required:true
    },

    purpose:{
        type:String,
        required:true
    },

    whomToMeet:{
        type:String,
        required:true
    },

    status:{
        type:String,
        default:"Pending"
    },
    
    entryTime: {
  type: Date,
  default: Date.now
},

exitTime: {
  type: Date,
  default: null
}


},
{
    timestamps:true
});


module.exports = mongoose.model("Visitor", visitorSchema);