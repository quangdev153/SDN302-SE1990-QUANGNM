const mongoose = require('mongoose')

const GenreSchema = new mongoose.Schema({
    type:String
})

const MovieSchema= new mongoose.Schema({
    title:{
        type:String
    },
    duration: {type:Number},
    status:{type:String,enum:[NOW_SHOWING,STOPPED],default:"NOW_SHOWING"},
    genre:{type:[GenreSchema],default:[]},
    description:{type:String}
})

module.exports = mongoose.model('Movie',MovieSchema)