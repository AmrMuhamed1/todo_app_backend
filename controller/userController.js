const asyncHandler = require('express-async-handler');
const User = require('../models/user');





//desc get all users
//api /api/users/profile
//method GET
//access private (Admin)


exports.getAllUsers = asyncHandler(async (req,res,next)=>{
 
 const users = await User.find();

 res.status(200).json({
    status:"success",
    users
 })



})
