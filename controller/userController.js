const asyncHandler = require('express-async-handler');
const User = require('../models/user');
var createError = require('http-errors');
const{ validateUpdateUser} = require('../validation/UserValidation')
const bcrypt = require('bcryptjs');
const path = require('path')
const {cloudinaryUploadFunction,cloudinaryRemoveFunction,cloudinaryMultiRemoveFunction} = require('../utils/cloudinary');
const { url } = require('inspector');
const fs = require('fs');
const Comment =require('../controller/postController')
const Post =require('../controller/postController')



//desc get all users
//api /api/users/profile
//method GET
//access private (Admin)


exports.getAllUsers = asyncHandler(async (req,res,next)=>{
 
 const users = await User.find().select('-password')
 res.status(200).json({
    status:"success",
    users
 })



})



//desc get one user profile 
//api /api/users/profile/id
//method GET
//access public 


exports.getUserCtrl = asyncHandler(async (req,res,next)=>{
 
    const user = await User.findById(req.params.id).select('-password').populate('posts');
    if(!user){
        return next(createError(404,'user not found '))
    }
   
    res.status(200).json({
       status:"success",
       user
    })
   
   
   
   })



//desc get update user profile 
//api /api/users/profile/id
//method PUT
//access private 


exports.updateUserProfileCtrl = asyncHandler(async (req,res,next)=>{

if(req.user.id  !== req.params.id){
    return next(createError.Forbidden('only user can update data'))

}



const {error} = validateUpdateUser(req.body);

if(error){
    return next(createError(400,error.details[0].message))

}
 
if(req.body.password){
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password,salt)
}

    const updatedUser = await User.findByIdAndUpdate(req.params.id,{
        $set:{
            username:req.body.username,
            password:req.body.password,
            bio:req.body.bio
        }
    },{new:true}).select('-password');
   
    res.status(200).json({
       status:"success",
       updatedUser
    })
   
   
   
   })


//desc get users count
//api /api/users/count
//method GET
//access private (Admin)


exports.getUserCount = asyncHandler(async (req,res,next)=>{
 
    const count  = await User.estimatedDocumentCount();
   
    res.status(200).json({
       status:"success",
      count
    })
   
   
   
   });


//desc profile photo upload
//api /api/users/profile/profilePhoto-upload
//method GET
//access private (user only )


exports.profilePhotoUploadCtrl = asyncHandler(async(req,res,next)=>{

    if(!req.file){
        return next(createError(400,'no file provided'))
    }

    const imagePath = path.join(__dirname,`../images/${req.file.filename}`)

    const result = await cloudinaryUploadFunction(imagePath);
    console.log(result);

    const user = await User.findById(req.user.id)

    if(user.profilePhoto.publicId != null){
        await cloudinaryRemoveFunction(user.profilePhoto.publicId)
    }


    user.profilePhoto = {
        url : result.secure_url,
        publicId: result.public_id,
    },

    await user.save();

    res.status(200).json({
        message : "success upload photo ",
        profilePhoto: {
            url : result.secure_url,
            publicId: result.public_id,
         }
    });


    fs.unlinkSync(imagePath);


})




//desc delete user profile 
//api /api/users/profile/:id
//method DELETE
//access private (user or admin )


exports.deleteUserProfile = asyncHandler(async (req,res,next)=>{

console.log(req.user.id )
console.log(req.params.id )
    if((req.user.id !== req.params.id)){
       return next(createError.Forbidden('not authorized'))
    }
    //1) get user from db 

    const user = await User.findById(req.user.id);

    if(!user){
        return next(createError(404, 'not found'))
    }

     const posts = await Post.find({user:user._id});

     const publicIds = posts.map((post)=>post.image.publicId);

     if(publicIds>0){
       await cloudinaryMultiRemoveFunction(publicIds);
     }


    //5) delete the profile photo 

        await cloudinaryRemoveFunction(user.profilePhoto.publicId);

        await Post.deleteMany({user:user._id});

        await Comment.deleteMany({user:user._id});
    



    //6)delete user himself


    await User.findByIdAndDelete(req.params.id);



    res.status(200).json({
        message:"deleted successfully "
    })


})
   