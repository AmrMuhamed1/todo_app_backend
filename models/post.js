const { required, object } = require('joi');
const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
title:{
    type:String,
    required:true,
    trim:true,
    minlength:2,
    maxlength :200
},
description:{
    type:String,
    required:true,
    trim:true,
    minlength:10,
    maxlength :200
},
user:{
    type:mongoose.Schema.ObjectId,
    required:true,
    ref:'User',
   
},
category:{
    type:String,
    required:true,
},
image:{
    type:Object,
    default:{
        url:"",
        publicId:null
    }
},
like:{
    type:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"

    }]
}
},{
    timestamps:true,
    toJSON: {virtuals:true},
    toObject:{virtuals:true}
}
)


postSchema.virtual('comment',{
    ref:'Comment',
    foreignField:"postId",
    localField:"_id"

})


const Post = mongoose.model('Post',postSchema);



module.exports = Post