const mongoose = require('mongoose');
const dotenv = require('dotenv').config()

module.exports = async()=>{
    try{
      await  mongoose.connect(process.env.DATA_BASE,)
    }catch(e){
        console.log(e);
    }
}