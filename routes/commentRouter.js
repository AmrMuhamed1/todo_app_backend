const router = require('express').Router();
const commentController  = require('../controller/commentContrller');
const {verifyToken} = require('../middlewares/verifyToken')

router.route('/').post(verifyToken,commentController.createComment)

