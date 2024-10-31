const Blog = require('../models/blogModel')
const User = require('../models/userModel')
const asyncHandler = require("express-async-handler")
const {validateMongoDbId} = require("../utils/validateMongodbId")
const mongoose = require('mongoose')





const createBlog = asyncHandler(async (req,res)=>{
    try {
        
        const newBlog = await Blog.create(req.body)
        res.json(newBlog)
    } catch (error) {
        throw new Error(error)
    }

})
const updateBlog = asyncHandler(async (req,res)=>{
    const {id} = req.params
    validateMongoDbId(blogId)

    try {
        const updateBlog = await Blog.findByIdAndUpdate(id,req.body,{
            new:true
        })
        res.json(updateBlog)
    } catch (error) {
        throw new Error(error)
    }
})
const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(blogId)

    try {
        const blog = await Blog.findById(id);
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            { $inc: { numViews: 1 } },
            { new: true }
        );

        res.json({
            blog: updatedBlog, 
            message: "Blog retrieved and views updated successfully!"
        });
    } catch (error) {
        throw new Error(error);
    }
});
const getAllBlog = asyncHandler(async (req,res)=>{
    try {
        const allblog = await Blog.find();
        // const updatedBlog = await Blog.findByIdAndUpdate(
        //     id,
        //     { $inc: { numViews: 1 } },
        //     { new: true }
        // );

        res.json(allblog)
    } catch (error) {
        throw new Error(error);
    }
})
const deleteBlog = asyncHandler(async (req,res)=>{
    const id = req.params.id; // Lấy đúng id từ req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }

    try {

        const deleteBlog = await Blog.findOneAndDelete({ _id: id });
        
        if (!deleteBlog) {
            return res.status(404).json({ message: "Product not found" });
        }

        console.log(deleteBlog);
        res.json(deleteBlog);
    } catch (error) {
        throw new Error(error);
    }
})
const likeTheBlog = asyncHandler(async (req,res) =>{
    console.log(req.body)
    const {blogId} = req.body;
    validateMongoDbId(blogId)
    //find the blog which you want to be liked
    const blog = await Blog.findById(blogId)
    //find login user
    const loginUserId = await req?.user?._id
    //find if the user has liked the post
    const isLiked = blog?.isLiked
    //find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.
    find((userId => userId?.toString()=== loginUserId?.toString()))

    if(alreadyDisliked){
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $pull:{dislikes : loginUserId},
            isDisliked:false
        })
        res.json(blog)
    }
    if(isLiked){
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $pull:{likes : loginUserId},
            isLiked:false
        })
        res.json(blog)
    }else{
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $push:{likes : loginUserId},
            isLiked:true
        })
        res.json(blog)
    }

})



module.exports = {
    deleteBlog,likeTheBlog,
    createBlog,updateBlog,
    getBlog,getAllBlog}
