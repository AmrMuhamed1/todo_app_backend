const mongoose = require('mongoose');


const CommentSchema = mongoose.Schema({
    postId:{
        type:mongoose.Schema.ObjectId,
        ref:"Post",
        required:true
    },
    postId:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    

},{
    timeStamps:true,
});

const comment = mongoose.model('Comment',CommentSchema);

module.exports=comment;