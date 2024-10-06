const asyncHandler = require('express-async-handler');
var createError = require('http-errors');
const{ validateUpdateComment,validateComment} = require('../validation/validateComment')
const Comment = require('../models/comment')
const User = require('../models/user');
const { text } = require('express');




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
        user: req.user.id,
        username:profile.username
    }); 

    res.status(201).json({
        comment
    })





})


//desc getAllComment
//api /api/post/
//method POST
//access admin 

exports.getAllComment = asyncHandler(async(req,res,next)=>{

   
    const comment = await Comment.find().populate('user');
    
        res.status(200).json({
            comment
        })
    
    
    
    
    
    })

//desc deleteComment
//api /api/delete/:id
//method DELETE
//access USER 

exports.deleteCommentController = asyncHandler(async(req,res,next)=>{

    const comment  = await Comment.findById(req.params.id);
    if(!comment) return next(createError(404,'not found'))

        if(!req.user.isAdmin || (req.user.id !== comment.user.toString()) ) return next(createError(404,'not authorized'))

         await Comment.findByIdAndDelete(req.params.id);

       return res.status(200).json({
            message:"delete success"
        })
    
    
    
    
    
    })




//desc updateComment
//api /api/comment/:id
//method PUT
//access private (user owner of comment)


exports.updateComment = asyncHandler(async(req,res,next)=>{

    const {error} = validateUpdateComment(req.body);
    
    if(error) return next(createError(400,error.details[0].message))
    
        const comment = await Comment.findById(req.params.id);
        if(!comment) return next(createError(404,'not found'))
    
       if(req.user.id !== comment.user.toString()) return next(createError(404,'not authorized'))

        const updateComment = await Comment.findByIdAndUpdate(req.params.id,{
            $set:{
                text:req.body.text
            }
        },{
            new:true
        })
    
        res.status(200).json({
            updateComment
        })
    
    
    
    
    
    })
    
    