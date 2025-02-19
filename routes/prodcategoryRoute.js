const express = require('express')
const router = express.Router();

const {createCategory,updateCategory,deleteCategory,
       getaCategory,getallCategory,
} = require('../controller/prodcategoryController')
    const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware')


router.post('/',authMiddleware,isAdmin,createCategory)
router.put('/:id',authMiddleware,isAdmin,updateCategory)
router.delete('/:id',authMiddleware,isAdmin,deleteCategory)
router.get('/',getallCategory)
router.get('/:id',getaCategory)


module.exports = router