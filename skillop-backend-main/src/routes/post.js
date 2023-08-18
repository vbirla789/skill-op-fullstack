const express = require("express");
const {
    createPost,
    likeAndUnlikePost,
    deletePost,
    getPostsFromFollowings,
    getPostsFromUser,
    getPosts,
    getPostsFromAll,
    updatePost,
} = require("../controllers/post");
const { isAuthorised } = require("../middleware/auth");
const { addComment, deleteComment } = require("../controllers/userComment");
const { postImagesUploader } = require("../uploads/handleUploads");
const router = express.Router();

router.route("/post/create").post(isAuthorised, postImagesUploader, createPost);
router.route("/post/like/:postId").put(isAuthorised, likeAndUnlikePost);
router.route("/post/delete/:postId").delete(isAuthorised, deletePost);
router.route("/post/from/followings").get(isAuthorised, getPostsFromFollowings);
router.route("/post/from/all").get(isAuthorised, getPostsFromAll);
router.route("/post/from/:userId").get(isAuthorised, getPostsFromUser);
router.route("/post/:postId").get(isAuthorised, getPosts);
router.route("/post/update/:postId").put(isAuthorised, updatePost);

router.route("/post/comment/add/:postId").post(isAuthorised, addComment);
router
    .route("/post/comment/delete/:commentId")
    .delete(isAuthorised, deleteComment);
module.exports = router;
