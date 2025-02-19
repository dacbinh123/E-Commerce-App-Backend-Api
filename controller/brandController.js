const Brand = require("../models/brandModel")
const asyncHandler = require("express-async-handler")
const {validateMongoDbId} = require("../utils/validateMongodbId")
const mongoose = require('mongoose')

const createBrand = asyncHandler(async (req,res)=>{
    try{
        const newBrand = await Brand.create(req.body)
        res.json(newBrand)
    }catch(error){
        throw new Error(error)
    }
})
const updateBrand = asyncHandler(async (req,res)=>{
    const id = req.params.id
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message:"Invalid brand ID"})
    }
    try{
        const updateBrand = await Brand.findByIdAndUpdate(id,req.body,{new:true})
        res.json(updateBrand)
    }catch(error){
        throw new Error(error)
    }
})
const deleteBrand = asyncHandler(async (req,res)=>{
    const id = req.params.id
    validateMongoDbId(id)

    try{
        const deleteBrand = await Brand.findByIdAndDelete(id)
        res.json(deleteBrand)
    }catch(error){
        throw new Error(error)
    }
})
const getallBrand = asyncHandler(async (req,res)=>{
    try {
        const getBrands = await Brand.find()
        res.json(getBrands)

    } catch (error) {
        throw new Error(error)
    }
})
// get a single users
const getaBrand= asyncHandler(async (req,res)=>{
    const {id}=req.params;
    console.log(id);
    validateMongoDbId(id)
    try {
        const getaBrand= await Brand.findById(id);
        res.json({
            getaBrand,
        })
    } catch (error) {
        throw new Error(error)
    }
})
module.exports={createBrand,updateBrand,deleteBrand,getaBrand,getallBrand}