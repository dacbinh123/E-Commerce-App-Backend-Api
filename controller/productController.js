const Product = require('../models/productModel')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const mongoose = require('mongoose')

const createProduct = asyncHandler(async (req, res) => {
    try {
        if(req.body.title){
            req.body.slug=slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct)
    } catch (error) {
        throw new Error(error)
    }

});

const getaProduct = asyncHandler( async (req,res) =>{
    const {id} = req.params
    try {
        const findProduct = await Product.findById(id)
        res.json(
            findProduct
        )
    } catch (error) {
        throw new Error(error)
    }
})

const getAllProduct = asyncHandler(async (req,res) =>{

    try {
        const queryObj={...req.query}
        const excludeFields = ['page','sort','limit','fields']
        excludeFields.forEach((el)=>delete queryObj[el])
        const getAllProduct= await Product.find(queryObj)
        res.json(getAllProduct)

    } catch (error) {
        throw new Error(error)
    }
})

const updateProduct = asyncHandler(async (req, res) => {
    const id = req.params.id; // Lấy đúng id từ req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }

    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await Product.findOneAndUpdate({ _id: id }, req.body, { new: true });
        
        if (!updateProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        console.log(updateProduct);
        res.json(updateProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteProduct = asyncHandler( async (req,res)=>{
    const id = req.params.id; // Lấy đúng id từ req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }

    try {

        const deleteProduct = await Product.findOneAndDelete({ _id: id });
        
        if (!deleteProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        console.log(deleteProduct);
        res.json(deleteProduct);
    } catch (error) {
        throw new Error(error);
    }
})
module.exports={createProduct,
    getaProduct,getAllProduct,
    updateProduct,deleteProduct}