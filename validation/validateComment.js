const joi = require('joi');



function validateComment(obj){

    const schema = joi.object({
        postId:joi.string().required(),
        text: joi.string().trim().required(),

    });

   return schema.validate(obj);

}

function validateUpdateComment(obj){

    const schema = joi.object({
        text: joi.string().trim(),
    });

   return schema.validate(obj);

}

module.exports = {
    validateComment,
    validateUpdateComment,
}