
var createError = require('http-errors');

exports.verifyAdmin= (req,res,next)=>{
    
    if(!req.user.isAdmin){
        return next(createError.BadRequest('not allowed , only admin'))
    }
    next();
    
}