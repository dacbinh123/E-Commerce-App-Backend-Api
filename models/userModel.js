const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')
const crypto = require('crypto')

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        index:true,
    },
    lastname:{
        type:String,
        required:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type: String,
        default: "user"
    },
    cart:{
        type: Array,
        default: [],
    },
    address:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
    }],
    wishlist:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",    
    }],
    isBlocked:{
        type: Boolean,
        default: false
    },
    refreshToken:{
        type: String,
    },
    passwordChangedAt:{
        passwordResetToken: String,
        passwordResetExpires:Date
    }
    }  ,
    {
    timestamps: true,
});

userSchema.pre('save',async function(next){
    if (!this.isModified('password')) {
        return next(); // Nếu mật khẩu không thay đổi, tiếp tục
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password,salt)
    next()
})
userSchema.methods.isPasswordMatched = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}
userSchema.methods.createPasswordResetToken=async function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordChangedAt.passwordResetToken=crypto
    .createHash('sha256')
    .update(resetToken)
    .digest("hex")
    this.passwordChangedAt.passwordResetExpires=Date.now()+30*60*1000 //10p

    console.log("user ",  this.passwordResetToken)
    
    return resetToken
}
//Export the model
module.exports = mongoose.model('User', userSchema);