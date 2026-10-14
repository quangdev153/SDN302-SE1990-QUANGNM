const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    _id:{
        type:String,
        default: () => new mongoose.Types.ObjectId().toString()
    },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  category:{
    type:String,
    require:true
  },
  isbn:{
    type:String,
    require:true
  },
  publishedYear:{
    type:Number,
    default:0,
    require:true
  },
  totalCopies:{
    type:Number,
    default:1,
    require:true
  },
  availableCopies:{
    type:Number,
    default:1,
    require:true
  }
},{timestamps:true});

module.exports = mongoose.model('Book', bookSchema);