const router = require('express').Router();
const userController = require('../controller/userController');
const {verifyToken} = require('../middlewares/verifyToken');
const {verifyAdmin} = require('../middlewares/verifyAdmin');
const {validateId} = require('../middlewares/validateId');
const {photoUpload} = require('../middlewares/photoUpload');




router.route("/profile").get(verifyToken,verifyAdmin,userController.getAllUsers)


router.route("/profile/:id").get(validateId,userController.getUserCtrl).put(validateId,verifyToken,userController.updateUserProfileCtrl).delete(verifyToken,userController.deleteUserProfile)


router.route('/count').get(verifyToken,verifyAdmin,userController.getUserCount)



router.route('/profile/profilePhoto').post(verifyToken,photoUpload.single("image"),userController.profilePhotoUploadCtrl)



module.exports = router;