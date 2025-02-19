const express = require('express')
const router = express.Router();

const {createProduct,getaProduct,
    getAllProduct,deleteProduct,addToWishlist,rating,
    updateProduct} = require('../controller/productController')
    const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware')

router.put('/wishlist',authMiddleware,addToWishlist)
router.put('/rating/rating',authMiddleware,rating)
router.post('/',authMiddleware,isAdmin,createProduct)
router.get('/:id',getaProduct)
router.get('/',getAllProduct)
router.put('/:id',authMiddleware,isAdmin,updateProduct)
router.delete('/:id',authMiddleware,isAdmin,deleteProduct)

module.exports = router