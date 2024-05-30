const express = require('express')
const multer = require('multer')
const {
    UserController,
    PostController,
    CommentController,
    LikeController
} = require("../controllers");

const checkToken = require("../middlewares/auth");
const router = express.Router();

const uploadDestination = 'uploads'

//Show where set files
const storage = multer.diskStorage({
    destination: uploadDestination,
    filename: function (req, file, next){
        next(null, file.originalname)
    }
})

const uploads = multer({storage})

const { createPost, getAllPosts, getPostById, updatePost, deletePost } = PostController
const { register, login, current, getUserById, updateUser } = UserController
const { createComment,  deleteComment } = CommentController
const { likePost,  unLikePost } = LikeController

//USER
router.post('/register', register)
router.post('/login', login)
router.get('/current', checkToken, current)
router.get('/user/:id', checkToken, getUserById)
router.put('/users/:id', checkToken, updateUser)

//POST
router.post('/posts', checkToken, createPost)
router.get('/posts', checkToken, getAllPosts)
router.get('/post/:id', checkToken, getPostById)
router.put('/post/:id', checkToken, updatePost)
router.delete('/post/:id', checkToken, deletePost)

//COMMENTS
router.post('/comments', checkToken, createComment)
router.delete('/comments/:id', checkToken, deleteComment)

//LIKE
router.post('/likes/', checkToken, likePost)
router.delete('/likes/:id', checkToken, unLikePost)


module.exports = router