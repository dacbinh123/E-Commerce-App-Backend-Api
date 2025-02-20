const express = require('express')
const router = express.Router();

const {createCoupon,getallCoupon,getaCoupon,updateCoupon,deleteCoupon
} = require('../controller/couponController')
    const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware')


router.post('/',authMiddleware,isAdmin,createCoupon)
router.put('/:id',authMiddleware,isAdmin,updateCoupon)
router.delete('/:id',authMiddleware,isAdmin,deleteCoupon)
router.get('/',getallCoupon)
router.get('/:id',getaCoupon)


module.exports = router