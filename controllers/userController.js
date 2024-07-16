const User=require('../models/userSchema');
const {errorHandler}=require('../utils/errorHandler');
const bcrypt=require('bcryptjs');

module.exports.updateUser=async(req,res,next)=>{
    try {

        if(req.user.id!==req.params.id && !req.user.isAdmin){
            return next(errorHandler(401,"you can only update your profile"));
        }

        if(req.body.password){
            req.body.password=await bcrypt.hash(req.body.password,10)
        }
        console.log(req.params.id)
        const updatedUser=await User.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true});
        console.log(updatedUser)

        res.status(200).json({message:"user updated successfully",user:updatedUser});
        
    } catch (error) {
        next(error);
    }
}

module.exports.deleteUser=async(req,res,next)=>{
    try {

        if(req.user.id!==req.params.id && !req.user.isAdmin){
            return next(errorHandler(401,"you can only delete your profile"));
        }

        const {id}=req.params;

        await User.findByIdAndDelete(id);

        res.status(200).json({message:"user deleted successfully"});
        
    } catch (error) {
        next(error);
    }
}

module.exports.getUser=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const user=await User.findById(id).select('-password -isAdmin -updatedAt -__v');

        res.status(200).json({user});
        
    } catch (error) {
        next(error);
    }
}

module.exports.followUser=async(req,res,next)=>{
    try {
        const {id}=req.params;
        if(req.user.id==id){
          return next(errorHandler(401,"you can't follow your account"));
        }
        const currentUser=await User.findById(req.user.id);
        const followingUser=await User.findById(id);

        currentUser.following.push(id);
        followingUser.followers.push(req.user.id);

        await Promise.all([currentUser.save(),followingUser.save()]);

        res.status(200).json(currentUser);
        
    } catch (error) {
        next(error);
    }
}

module.exports.followUser=async(req,res,next)=>{
    try {
        const {id}=req.params;
        if(req.user.id==id){
          return next(errorHandler(401,"you can't follow your account"));
        }
        const currentUser=await User.findById(req.user.id);
        const followingUser=await User.findById(id);

        currentUser.following.push(id);
        followingUser.followers.push(req.user.id);

        await Promise.all([currentUser.save(),followingUser.save()]);

        res.status(200).json(currentUser);
        
    } catch (error) {
        next(error);
    }
}

module.exports.unfollowUser=async(req,res,next)=>{
    try {
        const {id}=req.params;
        let index;
        if(req.user.id==id){
          return next(errorHandler(401,"you can't follow your account"));
        }
        const currentUser=await User.findById(req.user.id);
        const followingUser=await User.findById(id);
    
        index=currentUser.following.indexOf(id);
        currentUser.following.splice(index,1);
        
        index=followingUser.followers.indexOf(req.user.id);
        followingUser.followers.splice(index,1);

        await Promise.all([currentUser.save(),followingUser.save()]);

        res.status(200).json(currentUser)  
    } catch (error) {
        next(error)
    }
}

module.exports.searchUser=async(req,res,next)=>{
    try {
        let users=await User.find({
            ...(req.query.searchTerm && {username:{$regex:req.query.searchTerm, $options:'i'}}),
            _id:{$ne:req.user.id}
        });

        res.status(200).json({users});
        
    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports.getFollowers=async(req,res,next)=>{
    try {
        const userId=req.user.id;
        const currentUser=await User.findById(userId);

        const followers=await Promise.all(
            currentUser.followers.map((userId)=>{
                return User.find({_id:userId}).select("username profilePicture");
            })
        )
        res.status(200).json({followers:followers.flat()});    
    } catch (error) {
        next(error);
    }
}