const monogoose = require("mongoose")

const productSchema = new monogoose.Schema({
    name:{
        type: String,
        require : true,
    },
    price:{
        type: Number,
        require : true,
    },
    category:{
        type: String,
        require : true,
    },
    stock:{
        type: Number,
        require:true,
        min:0
    }
},{timestamps:true})
module.exports =mongoose.model("Product",productSchema);  