const express = require("express");
const { registerUser, loginUser, logout, changePassword } = require("../controllers/userAuth");
const { isAuthorised } = require("../middleware/auth");
const { followUnfollowUser } = require("../controllers/userUtils");
const { getMyProfile, getUserProfile, getAllUsers, searchUsers, updateProfile } = require("../controllers/userProfile");
const { resetPassword, forgetPassword } = require("../controllers/userForgetPassword");
const { profilePicUploader } = require("../uploads/handleUploads");

const router = express.Router();


router.route("/user/register").post(registerUser);
router.route("/user/login").post(loginUser);
router.route("/user/logout").get(logout);
router.route("/user/follow/:userId").put(isAuthorised, followUnfollowUser);
router.route("/user/changePassword").put(isAuthorised, changePassword);
router.route("/user/update/profile").put(isAuthorised,profilePicUploader, updateProfile)

router.route("/user/profile/me").get(isAuthorised, getMyProfile);
router.route("/user/profile/all").get(isAuthorised, getAllUsers);
router.route("/user/profile/:userId").get(isAuthorised, getUserProfile);
router.route("/user/profile/search").post(isAuthorised, searchUsers);

router.route("/user/password/forget").post(forgetPassword);
router.route("/user/password/reset/:token").put(resetPassword);

module.exports = router;