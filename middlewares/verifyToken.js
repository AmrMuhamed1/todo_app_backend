const JWT = require('jsonwebtoken');
var createError = require('http-errors');


exports.verifyToken = (req,res,next)=>{
    const authToken = req.headers.authorization
    if(authToken){
        const token = authToken.split(" ")[1];
        try {
            const decodedPayLod = JWT.verify(token,process.env.SECRET_JWT);
            req.user = decodedPayLod;
            next();
        }catch(error){
            return next(createError.Forbidden('token not success'))

        }
    }else { 
        
        return next(createError.Forbidden('token not provided'))

    }
}

