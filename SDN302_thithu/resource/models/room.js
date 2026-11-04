const mongoose = require("mongoose")

const SeatSchema= new mongoose.Schema({
    _id:{type:String},
    type:{
        type:String,
        enum:["VIP","NORMAL"],
        default:'NORMAL'
    }
})

const RoomSchema = new mongoose.Schema({
    roomName:{
        type: String,
        default: false
    },
    capacity: {type:Number},
    seats:{
        type:[SeatSchema],
        default: []
    }
})

module.exports = mongoose.model('Room',RoomSchema)