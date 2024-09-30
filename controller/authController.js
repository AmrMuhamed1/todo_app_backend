const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {validateUserRegister,validateUserLogin} = require('../validation/UserValidation');
var createError = require('http-errors');
var JWT = require('jsonwebtoken')

//desc register new user
//api /api/auth/register
//method POST
//access public



exports.registerUserCtrl = asyncHandler(async(req,res,next)=>{

//1) validation 
const {error} = validateUserRegister(req.body);

if(error){
    return next(createError(400, error.details[0].message));
}

//2) user is existed

let user = await User.findOne({email:req.body.email});

if(user){
    return next(createError(400,"user already exist"))

}

//3) hashPassword


const salt = await bcrypt.genSalt(10);
const hashPassword = await bcrypt.hash(req.body.password,salt);



//4) create user 

 user = await User.create({
    email:req.body.email,
    username:req.body.username,
    password:hashPassword
 });


// 4) todo verified account


//5) send to user

return res.status(201).json({
    status:"success",
    user,
})



});


//desc login user
//api /api/auth/login
//method POST
//access public



exports.loginCrl = asyncHandler(async (req,res,next)=>{

// 1) validation 

const {error} = validateUserLogin(req.body);

if(error){
    return next(createError(400, error.details[0].message));
}




//2) if user exist 

const user = await User.findOne({email:req.body.email})

if(!user){
    return next(createError(400,"user not exist"));
}


//3) check password 

const isPasswordMatch = await bcrypt.compare(req.body.password,user.password)

if(!isPasswordMatch){
    return next(createError(400,"password or email is invalid"));
}



// 4) todo verified account

//5) create token 

const token = user.generateAuthToken();


//6) send to user 

res.status(200).json({
    status:"success",
    id:user._id,
    isAdmin:user.isAdmin,
    email:user.email,
    profilePhoto:user.profilePhoto,
    token
})

})
