const Post = require('../models/postSchema');
const User=require('../models/userSchema');
const fs = require('fs');
const { errorHandler } = require('../utils/errorHandler');

//another way
// const newPostData = {
//     userId: userId
//   };

//   if (req.body && req.body.description) {
//     newPostData.description = req.body.description;
//   }

//   if (req.file) {
//     newPostData.postImage = filename;
//   }

//   const newPost = new Post(newPostData);
module.exports.addPost = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { description } = req.body;

        let filename;
        if (req.file) {
            filename = req.file.filename;
        }

        const newPost = new Post({
            userId,
            ...(req.body && { desc: description }),
            ...(req.file && { postImage: filename })
        })

        await newPost.save();

        res.status(200).json({ post: newPost });

    } catch (error) {
        console.log(error)
        if (req.file && fs.existsSync(`uploads/${req.file.filename}`)) {
            fs.unlinkSync(`uploads/${req.file.filename}`)
        }
        next(error);
    }
}

module.exports.editPost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (req.user.id !== post.userId) {
            return next(errorHandler(401, "you can edit only your post"));
        }
        let filename = post.postImage;
        if (req.file && fs.existsSync(`uploads/${post.postImage}`)) {
            filename = req.file.filename;
            fs.unlinkSync(`uploads/${post.postImage}`);
        }

        post.postImage = filename;
        post.desc = req.body.description ? req.body.description : post.desc;

        await post.save();

        res.status(200).json({ post });

    } catch (error) {
        if (req.file && fs.existsSync(`uploads/${req.file.filename}`)) {
            fs.unlinkSync(`uploads/${req.file.filename}`)
        }
        next(error);
    }
}

module.exports.deletePost = async (req, res, next) => {
    try {

        const { id } = req.params;
        const post = await Post.findById(id);
        if (req.user.id !== post.userId) {
            return next(errorHandler(401, "you can delete only your post"));
        }

        if (post.postImage && fs.existsSync(`uploads/${post.postImage}`)) {
            fs.unlinkSync(`uploads/${post.postImage}`);
        }

        await post.deleteOne();

        res.status(200).json({ message: "post deleted successfully" });

    } catch (error) {
        next(error)
    }
}

module.exports.getSinglePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            return next(errorHandler(401, "post not found"));
        }
        res.status(200).json({ post })

    } catch (error) {
        next(error)
    }
}

module.exports.getUserPost = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const posts = await Post.find({ userId }).populate("userId","username profilePicture").sort({createdAt:-1});

        res.status(200).json({ posts });

    } catch (error) {
        next(error)
    }
}

module.exports.toggleLike = async (req, res, next) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);

        if (!post.likes.includes(req.user.id)) {
            await post.updateOne({$push:{likes:req.user.id}});
            return res.status(200).json({ message: "post liked" });
        }

        await post.updateOne({ likes: { $pull: req.user.id } });
        res.status(200).json({ message: "post unliked" })

    } catch (error) {
        next(error)
    }
}

module.exports.timelinePost=async(req,res,next)=>{
    try {
        const currentUser=await User.findById(req.user.id);

        const posts=await Promise.all(
            currentUser.following.map(userId=>{
                return Post.find({userId}).select('-likes')
            })
        )
        res.status(200).json({posts:posts.flat()})
    } catch (error) {
        next(error)
    }
}