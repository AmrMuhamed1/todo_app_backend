const router = require('express').Router();
const authController = require('../controller/authController');



router.post("/register",authController.registerUserCtrl);
router.post("/login",authController.loginCrl);


module.exports = router