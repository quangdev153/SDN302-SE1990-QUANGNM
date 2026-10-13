const mongoose = require('mongoose');

const {SchemaTypes} = mongoose;

const orderItem = new mongoose.Schema({
    product_id:{
        type: SchemaTypes.ObjectId,
        ref:"Product",
        require:true
    },
    quantity:{
        type: Number,
        require:true,
        min:0
    },
    price_at_order:{
        type:Number,
        require:true,
        min:0
    },
    total:{
        type:Number,
        require:true,
        min:0
    }},{_id:false}
);

const orderSchema = new mongoose.Schema({
    customer_id:{
        type: SchemaTypes.ObjectId,
        ref:"customers",
        require:true
    },
    items:[
        orderItem
    ],
    total_amount:{
        type:Number,
        require:true,
        min:0
    },
    payment_method:{
        type:String,
        enum:['credit_card','debit_card','paypal','cash_on_delivery'],
        default:'cash_on_delivery'
    },
    status:{
        type:String,
        enum:['pending','shipped','delivered','cancelled'],
        default:'pending'
    },
    ordered_date:{
        type:Date,
        default:Date.now
    },
    created_at:{
        type:Date,
        default:Date.now
    },
    updated_at:{
        type:Date,
        default:Date.now
    }
},{timestamps:true})

orderSchema.pre("save",function(next){
    let totalAmount =0;
    this.orderItem.forEach((item) =>{
        totalAmount +=item.total;
    }),
    this.total_amount = totalAmount;
    next();
})

module.exports = orderSchema;
