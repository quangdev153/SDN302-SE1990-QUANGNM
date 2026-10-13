const Product = require('../module/Product');
async function getAllProduct(req,res){
    try{
        const products = await Product.find();
        res.status(200).json({products});
    }catch(error){
        res.status(500).json({message:error.message});
    }
}
async function getProductById(req,res){
    try{
        const {id} = req.params;
        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        res.status(200).json({product});
    }catch(error){
        res.status(500).json({message:error.message});
    }
}
async function createProduct(req,res){
    try{
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({product});
    }catch(error){
        res.status(500).json({message:error.message});
    }
}
async function updateProduct(req,res){
    try{
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id,req.body,{new:true});
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        res.status(200).json({product});
    }catch(error){
        res.status(500).json({message:error.message});
    }
}
async function deleteProduct(req,res){
    try{
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        res.status(200).json({product});
    }catch(error){
        res.status(500).json({message:error.message});
    }
}
module.exports = {getAllProduct,getProductById,createProduct,updateProduct,deleteProduct};
