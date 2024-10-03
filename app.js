const express = require('express');
const connectDb = require('./config/connectToDB');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
const commentRouter = require('./routes/commentRouter');
// connect to DB

connectDb();

//init app 

const app = express();


// Middlewares
app.use(express.json())




// routes

app.use('/api/auth',authRouter);
app.use('/api/users',userRouter);
app.use('/api/post',postRouter);
app.use('/api/comment',postRouter);



// running server 


const port = process.env.PORT || 8000;

app.listen(port,()=>{
    console.log(`app is running in ${process.env.ENV} on port ${port}`);
})