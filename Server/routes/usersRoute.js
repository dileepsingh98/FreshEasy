var express = require('express');

var router = express.Router();

var ctrUsers = require('../Controllers/usersController');

var {authenticate} = require('../middleware/authenticate');

router.route("/").post(ctrUsers.addUser);

router.route("/login").post(ctrUsers.loginUser);

router.route("/verifyotp").post(authenticate,ctrUsers.verifyotp);

router.route("/password").post(authenticate,ctrUsers.updatePassword);

router.route("/logout").delete(authenticate,ctrUsers.logoutUser);

router.route("/").patch(authenticate,ctrUsers.updateUserInformation);

router.route("/upload").post(authenticate,ctrUsers.uploadProfile);

router.route("/checkmobile").post(ctrUsers.checkmobile);

router.route("/me").get(authenticate,ctrUsers.getUserInformation);

module.exports = router;
