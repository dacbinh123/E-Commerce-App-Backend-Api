const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')
// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,

    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numViews:{
        type:Number,
        default: 0
    },
    isLiked:{
        type: Boolean,
        default: false
    },
    isDisLiked:{
        type: Boolean,
        default: false
    },
    like:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    dislike:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    image:{
        type:String,
        default:"https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg"
    },
    author:{
        type:String,
        default:"admin"
    },
},{
    toJSON:{
        virtuals: true
    },
    toObject:{
        virtuals: true
    },
    timestamps: true,

})

//Export the model
module.exports = mongoose.model('Blog', blogSchema);