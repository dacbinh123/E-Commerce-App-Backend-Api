const User = require('../models/userModel');
const asyncHandler = require("express-async-handler");
const {generateToken} = require("../config/jwtToken")
const {validateMongoDbId} = require("../utils/validateMongodbId")
const {generateRefreshToken} = require("../config/refreshToken");
const { JsonWebTokenError } = require('jsonwebtoken');
const jwt = require("jsonwebtoken")
const crypto = require('crypto')
const {sendEmail} = require('./emailController')

const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email });
    
    if (!findUser) {
        // Tạo người dùng mới
        const newUser = await User.create(req.body);
        res.status(201).json(newUser); // Trả về mã trạng thái 201
    } else {
        throw new Error("User Already exxist")
    }
});
const loginUserController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Tìm người dùng
    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findUser?.id)
        const updateUser = await User.findByIdAndUpdate(
            findUser.id,
            {
                refreshToken: refreshToken,
            },
            {
                new:true,
            }
        )
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24*60*60*1000,
        })
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token:generateToken(findUser?._id),
     });
    } else {
        throw new Error("Invalid Credentials");
    }
});
//handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
        throw new Error("No refresh token in Cookies");
    }
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken);
    
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error('No refresh token present in db or not matched');
    
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token");
        } else {
            const accessToken = generateToken(user?._id)
            res.json({accessToken})
        }
    });
    
});
//logout
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    
    // Kiểm tra cookie để lấy refresh token
    if (!cookie?.refreshToken) {
        return res.status(400).json({ message: "No refresh token in Cookies" }); // Trả về thông báo lỗi
    }

    const refreshToken = cookie.refreshToken;
    
    // Tìm người dùng dựa trên refresh token
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        });
        return res.sendStatus(204); // Không có nội dung
    }

    // Cập nhật người dùng để xóa refresh token
    await User.findOneAndUpdate({ _id: user._id }, {
        refreshToken: ""
    });

    // Xóa cookie refresh token
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    });

    // Trả về mã trạng thái 204
    return res.sendStatus(204); // Không có nội dung
});

//update user
const updateaUser = asyncHandler(async (req,res)=>{
    console.log(req.user)
    const {id} = req.params;
    validateMongoDbId(id)
    try {
        const updateaUser = await User.findByIdAndUpdate(id,{
            firstname : req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile
        },{
            new:true,
        })
        res.json(updateaUser);
    } catch (error) {
        throw new Error(error)

    }
})
// Get all user
const getallUser = asyncHandler(async (req,res)=>{
    try {
        const getUsers = await User.find()
        res.json(getUsers)

    } catch (error) {
        throw new Error(error)
    }
})
// get a single users
const getaUser= asyncHandler(async (req,res)=>{
    const {id}=req.params;
    console.log(id);
    validateMongoDbId(id)
    try {
        const getaUser= await User.findById(id);
        res.json({
            getaUser,
        })
    } catch (error) {
        throw new Error(error)
    }
})
//delete user
const deleteaUser= asyncHandler(async (req,res)=>{
    console.log(req.params)
    const {id}=req.params;
    console.log(id);
    validateMongoDbId(id)

    try {
        const deleteaUser= await User.findByIdAndDelete(id);
        res.json({
            deleteaUser,
        })
    } catch (error) {
        throw new Error(error)
    }
})
//block user
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)

    try {
        const blockedUser = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true,
            },
            {
                new: true
            }
        );

        // Kiểm tra xem người dùng có bị tìm thấy hay không
        if (!blockedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "User blocked",
            user: blockedUser // Bạn có thể trả về thông tin người dùng đã bị chặn
        });
    } catch (error) {
        throw new Error(error);
    }
});

const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)

    try {
        const unblockedUser = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: false,
            },
            {
                new: true
            }
        );

        // Kiểm tra xem người dùng có bị tìm thấy hay không
        if (!unblockedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "User unblocked",
            user: unblockedUser // Bạn có thể trả về thông tin người dùng đã được mở khóa
        });
    } catch (error) {
        throw new Error(error);
    }
});
const updatePassword = asyncHandler(async(req,res)=>{
    const{_id} = req.user;
    const {password} = req.body;
    validateMongoDbId(_id)
    const user = await User.findById(_id);
    if(password){
        user.password=password;
        const updatePassword = await user.save();
        res.json(updatePassword)
    }else{
        res.json(user)
    }
})

//forgot password token

const forgotPasswordToken = asyncHandler(async(req,res)=>{
    const {email} = req.body;
    const user = await User.findOne({email})
    if(!user){
        throw new Error('user not found with this email')
    }
    try {
        const token = await user.createPasswordResetToken()
        await user.save()
        console.log(user)
        const resetURL =
         `Hi, please follow this link to reset your Password. 
         This link is valid till 10 minutes from now. 
         <a href='http://localhost:3000/api/user/reset-password/${token}'>
         click here</a>`
        const data={
            to: email,
            text:"HEY User",
            subject:"Forgot Password Link",
            html:resetURL
        }
        sendEmail(data);
        res.json(token)
    } catch (error) {
        throw new Error(error)
    }
})

const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    console.log("hashedToken ", hashedToken);

    const user = await User.findOne({
        'passwordChangedAt.passwordResetToken': hashedToken,
        'passwordChangedAt.passwordResetExpires': { $gt: Date.now() }
    });
    console.log(user)
    if (!user) {
        return res.status(400).json({ message: "Token expired or invalid. Please request a new token." });
    }

    user.password = password;
    user.passwordChangedAt.passwordResetToken = undefined; // Xóa token cũ
    user.passwordChangedAt.passwordResetExpires = undefined; // Xóa thời gian hết hạn
    await user.save();

    res.status(200).json({ message: "Password reset successful!" });
});

module.exports = {resetPassword,forgotPasswordToken,updatePassword,logout,handleRefreshToken, createUser,blockUser,unblockUser,loginUserController,getallUser,getaUser,deleteaUser,updateaUser }; // Xuất hàm createUser
