const router = require('express').Router();
const userController = require('../controller/userController');
const {verifyToken} = require('../middlewares/verifyToken')




router.route("/profile").get(verifyToken,userController.getAllUsers)




module.exports = router;