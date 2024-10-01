const Joi = require('joi');


function validatePost (obj){
    const schema = Joi.object({
        title:Joi.string().trim().min(2).max(200).required(),
        description:Joi.string().trim().min(10).max(200).required(),
        category:Joi.string().trim().required(),

    });

    return schema.validate(obj);
}


function validateUpdatePost (obj){
    const schema = Joi.object({
        title:Joi.string().trim().min(2).max(200),
        description:Joi.string().trim().min(10).max(200),
        category:Joi.string().trim(),

    });

    return schema.validate(obj);
}


module.exports ={
    validatePost,
    validateUpdatePost
}