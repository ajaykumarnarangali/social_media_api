const router=require('express').Router();
const {verify}=require('../utils/verify');
const {uploadImage}=require('../utils/uploadImage');
const postController=require('../controllers/postController');


router.post('/add-post',verify,uploadImage().single('image'),postController.addPost);
router.put('/edit-post/:id',verify,uploadImage().single('image'),postController.editPost);
router.delete('/delete-post/:id',verify,postController.deletePost);
router.get('/single-post/:id',verify,postController.getSinglePost);
router.get('/user-post',verify,postController.getUserPost);
router.put('/toggle-like/:id',verify,postController.toggleLike);
router.get('/timeline-post',verify,postController.timelinePost);



module.exports=router;