const mongoose=require('mongoose');

const postSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    postImage:{
        type:String
    },
    likes:{
        type:Array,
        default:[]
    }
},{timestamps:true});

module.exports=mongoose.model('Post',postSchema);