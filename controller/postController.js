const asyncHandler = require('express-async-handler');
const Post = require('../models/post');
var createError = require('http-errors');
const{ validatePost,validateUpdatePost} = require('../validation/postValidation')
const bcrypt = require('bcryptjs');
const path = require('path')
const {cloudinaryUploadFunction,cloudinaryRemoveFunction} = require('../utils/cloudinary');
const fs = require('fs');
const { title } = require('process');


//desc createNewPost
//api /api/post/
//method POST
//access private (user)



exports.createPost = asyncHandler(async(req,res,next)=>{
    //1)validationImage 
    if(!req.file) return next(createError(400,'no image provided'));





    //2)validate data

    const {error} = validatePost(req.body);

    if(error) return next(createError(400,error.details[0].message));




    //3) uploadImage


    const imagePath = path.join(__dirname,`../images/${req.file.filename}`);

    const result =await  cloudinaryUploadFunction(imagePath)





    //4)create new post 


    const post = await Post.create(
        {
            title:req.body.title,
            description:req.body.description,
            category:req.body.category,
            user:req.user.id,
            image:{
                url:result.secure_url,
                publicId:result.public_id
            }
        }
    );



    //5)send response to client 
    res.status(201).json({
        post
    })



    //6) remove image from folder

    fs.unlinkSync(imagePath);
})



//desc getAllPost
//api /api/post/
//method GET
//access public

exports.getAllPosts = asyncHandler(async(req,res,next)=>{

    post_per_page = 3;
    const {pageNumber,category} = req.query;
    let posts; 
    if(pageNumber){
        posts = await Post.find().skip((pageNumber-1)*post_per_page).limit(post_per_page).sort({createdAt: -1}).populate('user',['-password']);
    }else if(category){
        posts = await Post.find({category}).sort({createdAt: -1}).populate('user',['-password'])
    }else {
        posts = await Post.find().sort({createdAt: -1}).populate('user',['-password'])
    }


    res.status(200).json({
        posts
    })

});

//desc getOnPost
//api /api/post/:id
//method GET
//access public


exports.getOnePost = asyncHandler(async(req,res,next)=>{

    const post = await Post.findById(req.params.id).populate('user',['-password']);

    if(!post){
        return next(createError(404,'post not found'))
    }


    res.status(200).json({
        post
    })

});



//desc deletePost
//api /api/post/:id
//method DELETE
//access private (user)



exports.deletePost = asyncHandler(async(req,res,next)=>{

    const post = await Post.findById(req.params.id);

    if(!post){
        return next(createError(404,'post not found'))
    }

    if(req.user.id !== post.user.toString()){
        
        return next(createError.Forbidden('only owner can do it'))

    }
    await Post.findByIdAndDelete(req.params.id);

    await cloudinaryRemoveFunction(post.image.publicId);


    res.status(200).json({
        message:'success deleted successfully'
    })

});

exports.updatePost = asyncHandler(async(req,res,next)=>{

const {error} = validateUpdatePost(req.body);

if(error){
    return next(createError(400,error.details[0].message))
}


const post = await Post.findById(req.params.id)

if(!post){
    return next(createError(400,'post not found'))

}

if(req.user.id !== post.user.toString()) return(next(createError(404,'not access to you')));

const updatedPost = await Post.findByIdAndUpdate(req.params.id,{
    $set:{
        title:req.body.title,
        description:req.body.description,
        category:req.body.category,

    },
},{
    new:true
},);

res.status(200).json({
    message:'post updated successfully',
    updatedPost
})
})






exports.updatePostImage = asyncHandler(async(req,res,next)=>{

    const {error} = validateUpdatePost(req.body);
    
    if(error){
        return next(createError(400,error.details[0].message))
    }
    
    
    const post = await Post.findById(req.params.id)
    
    if(!post){
        return next(createError(400,'post not found'))
    
    }
    
    if(req.user.id !== post.user.toString()) return(next(createError(404,'not access to you')));
    
    await cloudinaryRemoveFunction(post.image.publicId);

    const imagePath = path.join(__dirname,`../images/${req.file.filename}`);

    const result = await cloudinaryUploadFunction(imagePath);

    const updatedPost = await Post.findByIdAndUpdate(req.params.id,{
        image:{
            url:result.url,
            publicId:result.public_id
        }
    })





    res.status(200).json({
        message:'post updated successfully',
        updatedPost
    });

    fs.unlinkSync(imagePath)
    })
    


    exports.toggleLikes = asyncHandler(async(req,res,next)=>{

        let post = await Post.findById(req.params.id)
    
        if(!post){
            return next(createError(400,'post not found'))
        }

        const postIsAlreadyLiked = post.like.find((user)=>user.toString === req.user.id);

        if(postIsAlreadyLiked){
            post = await Post.findByIdAndUpdate(req.params.id,{
                $pull:{
                    like:req.user.id
                }
            },{
                new:true

            })
        }else {
            post = await Post.findByIdAndUpdate(req.params.id,{
                $push:{
                    like:req.user.id
                }
            },{
                new:true
            });
        }


        res.status(200).json({
            post
        })
        


    })