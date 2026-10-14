const moongoose = require("mongoose");

const memberSchema = new moongoose.Schema({
    _id:{
        type:String,
        default: () => new mongoose.Types.ObjectId().toString()
    },
    fullname:{
        type:String,
        require:true
    },
    email:{
        type: String,
        require:true
    },
    phone:{
        type:String,
        require:true
    },
    membershipType:{
        type:String,
        require:true
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{timestamps:true});

module.exports = moongoose.model('Member', memberSchema);