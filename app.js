const express = require('express');
const connectDb = require('./config/connectToDB');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
// connect to DB

connectDb();

//init app 

const app = express();


// Middlewares
app.use(express.json())




// routes

app.use('/api/auth',authRouter);
app.use('/api/users',userRouter);



// running server 


const port = process.env.PORT || 8000;

app.listen(port,()=>{
    console.log(`app is running in ${process.env.ENV} on port ${port}`);
})