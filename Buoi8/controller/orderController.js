const Order = require("./module/Order.js")

async function getAllOrders(req,res){
    try{
        const orders = await Order.find();
        res.status(200).json({orders})
    } catch(error){
        res.status(500).json({message:error.message})
    }
}
async function getOrderById (req,res){
    try {
        const {id} = req.params;
        const order = await Order.findById(id);
        if(!order){
            return res.status(404).json({message:"Order not found"})
        }
        res.status(200).json({order})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
async function createOrder(req,res){
    try {
        const order = await Order.create(req.body);
        const result = await order.save().then((doc)=> doc.populate("customer_id").populate("orderItem.product_id"))
        res.status(201).json({order:result});
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
async function updateOrder(req,res){
    try {
        const {id} = req.params;
        const order = await Order.findByIdAndUpdate(id,req.body,{new:true,runValidators:true}).populate("customer_id").populate("orderItem.product_id");
        if(!order){
            return res.status(404).json({message:"Order not found"})
        }
        res.status(200).json({order})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
async function deleteOrder(req,res){
    try {
        const {id} = req.params;
        const order = await Order.findByIdAndDelete(id);
        if(!order){
            return res.status(404).json({message:"Order not found"})
        }
        res.status(200).json({order})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
module.exports = {getAllOrders,getOrderById,createOrder,updateOrder,deleteOrder}