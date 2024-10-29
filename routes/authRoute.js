const express = require("express");
const router = express.Router();

const {logout,handleRefreshToken,
    blockUser,unblockUser, 
    createUser,loginUserController,
    getallUser,updateaUser,getaUser,
    deleteaUser } = require("../controller/userController");
const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware')



router.post('/register', createUser);
router.post('/login', loginUserController);
router.get('/logout', logout);
router.get('/all-users', getallUser);
router.get('/refresh', handleRefreshToken);
router.get('/:id',authMiddleware,isAdmin, getaUser);
router.delete('/:id', deleteaUser);
router.put('/edit-user/:id', authMiddleware,updateaUser);
router.put('/block-user/:id', authMiddleware,isAdmin,blockUser);
router.put('/unclock-user/:id', authMiddleware,isAdmin,unblockUser);

module.exports = router;
