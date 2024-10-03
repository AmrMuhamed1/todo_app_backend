const mongoose = require('mongoose');
const dotenv = require('dotenv').config()

module.exports = async()=>{
    try{
      await  mongoose.connect(process.env.DATA_BASE,)
      console.log('success running app to db ')
    }catch(e){
        console.log(e);
    }
}