const router=require('express').Router();
const {verify}=require('../utils/verify');
const userController=require('../controllers/userController');

router.put('/update-user/:id',verify,userController.updateUser);
router.delete('/delete-user/:id',verify,userController.deleteUser);
router.get('/user/:id',verify,userController.getUser);
router.put('/follow/:id',verify,userController.followUser);
router.put('/unfollow/:id',verify,userController.unfollowUser);
router.get('/search-user',verify,userController.searchUser);
router.get('/followers',verify,userController.getFollowers);

module.exports=router;