const router = require('express').Router();
const commentController  = require('../controller/commentContrller');
const {verifyToken} = require('../middlewares/verifyToken');
const {verifyAdmin} = require('../middlewares/verifyAdmin');
const {validateId}=require('../middlewares/validateId')


router.route('/').post(verifyToken,commentController.createComment).get(verifyToken,verifyAdmin,commentController.getAllComment)
router.route('/:id').delete(validateId,verifyToken,commentController.deleteCommentController).put(validateId,verifyToken,commentController.updateComment);



module.exports = router;