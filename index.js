const express=require('express');
const app=express();
const cors=require('cors');
const path=require('path');
const morgan=require('morgan');
const {connection}=require('./connection/connection');
const cookieParser=require('cookie-parser');
require('dotenv').config();

const authRouter=require('./routers/authRouter');
const userRouter=require('./routers/userRouter');
const postRouter=require('./routers/postRouter');


app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));


app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/post',postRouter);


app.use((err,req,res,next)=>{
    res.status(err.status || 500).json({
        success:false,
        error:err.message
    })
})

connection();
const PORT=3000;
app.listen(PORT,()=>{
    console.log("server running successfully");
})