const Joi = require('joi');

function validateUserRegister (obj){
    const schema = Joi.object({
            username:Joi.string().trim().min(2).max(100).required(),
            email:Joi.string().trim().min(5).max(100).required().email(),
            password:Joi.string().trim().min(8).required(),
    });

    return schema.validate(obj);
}



function validateUserLogin(obj){
    const schema = Joi.object({
        email:Joi.string().trim().min(5).max(100).required().email(),
        password:Joi.string().trim().min(8).required(),
    });
    return schema.validate(obj);

}












module.exports = {
    validateUserRegister,
    validateUserLogin,
}