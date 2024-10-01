const mongoose = require('mongoose');
var createError = require('http-errors');



exports.validateId = (req,res,next)=>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
       return next(createError(400,'invalid id'))
    }
    next();
}