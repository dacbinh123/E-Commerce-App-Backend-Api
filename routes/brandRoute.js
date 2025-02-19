const express = require('express')
const router = express.Router();

const {createBrand,updateBrand,deleteBrand,
       getaBrand,getallBrand,
} = require('../controller/brandController')
    const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware')


router.post('/',authMiddleware,isAdmin,createBrand)
router.put('/:id',authMiddleware,isAdmin,updateBrand)
router.delete('/:id',authMiddleware,isAdmin,deleteBrand)
router.get('/',getallBrand)
router.get('/:id',getaBrand)


module.exports = router