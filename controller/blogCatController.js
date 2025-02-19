const Category = require("../models/blogCatModel")
const asyncHandler = require("express-async-handler")
const {validateMongoDbId} = require("../utils/validateMongodbId")
const mongoose = require('mongoose')

const createCategory = asyncHandler(async (req,res)=>{
    try{
        const newCategory = await Category.create(req.body)
        res.json(newCategory)
    }catch(error){
        throw new Error(error)
    }
})
const updateCategory = asyncHandler(async (req,res)=>{
    const id = req.params.id
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message:"Invalid category ID"})
    }
    try{
        const updateCategory = await Category.findByIdAndUpdate(id,req.body,{new:true})
        res.json(updateCategory)
    }catch(error){
        throw new Error(error)
    }
})
const deleteCategory = asyncHandler(async (req,res)=>{
    const id = req.params.id
    validateMongoDbId(id)

    try{
        const deleteCategory = await Category.findByIdAndDelete(id)
        res.json(deleteCategory)
    }catch(error){
        throw new Error(error)
    }
})
const getallCategory = asyncHandler(async (req,res)=>{
    try {
        const getCategorys = await Category.find()
        res.json(getCategorys)

    } catch (error) {
        throw new Error(error)
    }
})
// get a single users
const getaCategory= asyncHandler(async (req,res)=>{
    const {id}=req.params;
    console.log(id);
    validateMongoDbId(id)
    try {
        const getaCategory= await Category.findById(id);
        res.json({
            getaCategory,
        })
    } catch (error) {
        throw new Error(error)
    }
})
module.exports={createCategory,updateCategory,deleteCategory,getaCategory,getallCategory}