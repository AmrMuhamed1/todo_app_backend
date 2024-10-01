const router = require('express').Router();
const {photoUpload} = require('../middlewares/photoUpload');
const {verifyToken} = require('../middlewares/verifyToken');
const postController = require('../controller/postController');
const {validateId} = require('../middlewares/validateId');









router.route('/').post(verifyToken,photoUpload.single("image"),postController.createPost).get(postController.getAllPosts);
router.route('/:id').get(validateId,postController.getOnePost).delete(validateId,verifyToken,postController.deletePost).put(validateId,verifyToken,postController.updatePost);
router.route('/update-photo/:id').put(validateId,verifyToken,photoUpload.single('image'),postController.updatePostImage)
router.route('/likes/:id').put(validateId,verifyToken,postController.toggleLikes);

module.exports=router;