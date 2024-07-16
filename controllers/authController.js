const res = require('express/lib/response');
const User=require('../models/userSchema');
const {errorHandler}=require('../utils/errorHandler');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

module.exports.signUp=async(req,res,next)=>{
    try {
        const {username,email,password}=req.body;
        
        if(!username || !email || !password){
            return next(errorHandler(401,"enter all the fields"));
        }

        const isUserExist=await User.findOne({$or:[{username},{email}]});

        if(isUserExist){
            return next(errorHandler(401,"user already exist"));
        }
        const hashedPassword=await bcrypt.hash(password,10);

        const newUser=new User({
            username,
            email,
            password:hashedPassword
        });
        
        await newUser.save();

        res.status(200).json({message:"user registration successfull"});
        
    } catch (error) {
        next(error);
    }
}

module.exports.signIn=async(req,res,next)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return next(errorHandler(401,"enter all the fields"));
        }
        
        const existingUser=await User.findOne({email});

        if(!existingUser){
            return next(errorHandler(401,"invalid email"));
        }

        const isMatching=await bcrypt.compare(password,existingUser.password);

        if(!isMatching){
            return next(errorHandler(401,"incorrect password"));
        }

        const token=jwt.sign({id:existingUser._id,isAdmin:existingUser.isAdmin},process.env.secret);

        const {password:pass,followers:follo,...rest}=existingUser._doc;

        res.cookie("access_token",token).status(200).json({message:'login successfully',user:rest})

    } catch (error) {
        next(error)
    }
}

module.exports.signOut=(req,res,next)=>{
    try {
        res.clearCookie('access_token').status(200).json({message:"signout successfully"});
    } catch (error) {
        next(error);
    }
}