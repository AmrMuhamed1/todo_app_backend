const asyncHandler = require('express-async-handler');
var createError = require('http-errors');
const{ validateUpdateComment,validateComment} = require('../validation/validateComment')
const Comment = require('../models/comment')
const User = require('../models/user')




//desc createComment
//api /api/post/
//method POST
//access private (user)


exports.createComment = asyncHandler(async(req,res,next)=>{

const {error} = validateComment(req.body);

if(error) return next(createError(400,error.details[0].message))

    const profile = await User.findById(req.user.id);

    const comment = await Comment.create({
        postId: req.body.postId,
        text:req.body.text,
        user: req.user.findById,
        username:profile.username
    });

    res.status(201).json({
        comment
    })





})