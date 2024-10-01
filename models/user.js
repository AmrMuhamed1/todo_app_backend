const mongoose = require('mongoose');
const JWT = require('jsonwebtoken');



const UserSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        minlength:2,
        maxlength:100,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:5,
        maxlength:100,
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:8,
    },
    profilePhoto:{
        type:Object,
        default:{
            url:"",
            publicId:null
        }
    },
    bio:String,
    isAdmin:{
        type:Boolean,
        default:false
    },
    isAccountVerified:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});



UserSchema.virtual('posts',{
    ref:'Post',
    foreignField: 'user',
    localField :'_id'
})

//generate Token 

UserSchema.methods.generateAuthToken = function(){
   return JWT.sign({ id: this._id,isAdmin: this.isAdmin}, process.env.SECRET_JWT,{
    expiresIn:'30d'
   })
}

const User = mongoose.model('User',UserSchema);


module.exports = User;