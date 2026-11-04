const mongoose = require("mongoose")

const ShowtimeSchema = new mongoose.Schema({
movieId:{
    type: Schema.Types.ObjectId,
    ref:'Movie'
},
roomId:{
    type: Schema.Types.ObjectId,
    ref:'Room'
},
startTime:{
    type:Date,
    default:Date.now
},
endTime:{
    type:Date,
    default:Date.now
}
})

module.exports = mongoose.model('Showtime',ShowtimeSchema)