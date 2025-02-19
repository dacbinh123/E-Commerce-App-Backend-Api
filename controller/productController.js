const Product = require('../models/productModel')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const mongoose = require('mongoose')
const User = require('../models/userModel');

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

const getAllProduct = asyncHandler(async (req, res) => {
    try {
        //filer loc
        const queryObj = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((el) => delete queryObj[el]);
        console.log(queryObj)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => '$' + match);
        // gte: lớn hơn hoặc bằng (>=)
        // gt: lớn hơn (>)
        // lte: nhỏ hơn hoặc bằng (<=)
        // lt: nhỏ hơn (<)
        // console.log(JSON.parse(queryStr))

        let query = Product.find (JSON.parse(queryStr))


        //sort
        if(req.query.sort){
            const sortBy = req.query.sort.split(",").join(" ")
            query =query.sort(sortBy)
        }else{
            query = query.sort('-createdAt')
        }


        //limiting the fields
        if(req.query.fields){
            const fields = req.query.fields.split(",").join(" ")
            query =query.select(fields)

        }else{
            query = query.select('-__v')
        }

        // pagination
        const page = req.query.page
        const limit = req.query.limit
        const skip = (page -1)*limit;
        query = query.skip(skip).limit(limit)
        if(req.query.page){
            const productCount= await Product.countDocuments()
            if(skip>=productCount){
                throw new Error('This Page does not exists')
            }
        }
        console.log(page,limit,skip)





        const product = await query
        res.json(product);
    } catch (error) {
        throw new Error(error);
    }
});


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

const addToWishlist = asyncHandler(async (req, res) => {
    const  {_id}  = req.user;
    const { proId } = req.body;
    console.log("-----")
    console.log(proId,_id)
    console.log("-----")

    try {
        const user = await User.findById(_id);
        const alreadyadded = user.wishlist.find((id) => id.toString() === proId); 

        if (alreadyadded) {
            let user = await User.findByIdAndUpdate(
                _id,
                { $pull: { wishlist: proId } },
                { new: true }
            );
            res.json(user);
        } else {
            let user = await User.findByIdAndUpdate(
                _id,
                { $push: { wishlist: proId } },
                { new: true }
            );
            res.json(user);
        }
    } catch (error) {
        throw new Error(error);
    }
});

const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, prodId } = req.body;

    try {
        const product = await Product.findById(prodId);
        console.log(product)

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let alreadyRated = product.ratings.find(
            (userId) => userId.postedby.toString() === _id.toString()
        );

        if (alreadyRated) {
            // Cập nhật đánh giá nếu đã tồn tại
            const updatedRating = await Product.findOneAndUpdate(
                { _id: prodId, "ratings.postedby": _id },
                { $set: { "ratings.$.star": star } },
                { new: true }
            );
        } else {
            // Thêm đánh giá mới nếu chưa tồn tại
            const rateProduct = await Product.findByIdAndUpdate(
                prodId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            postedby: _id,
                        },
                    },
                },
                { new: true }
            );
        }
        const getallratings = await Product.findById(prodId);
        let totalRating = getallratings.ratings.length;
        let ratingsum = getallratings.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingsum / totalRating);
        let finalproduct = await Product.findByIdAndUpdate(
            prodId,
            {
                totalrating: actualRating,
            },
            { new: true }
        );
        res.json(finalproduct);
        
    } catch (error) {
        console.error("Error updating rating:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



module.exports={createProduct,
    getaProduct,getAllProduct,rating,
    updateProduct,deleteProduct,addToWishlist}