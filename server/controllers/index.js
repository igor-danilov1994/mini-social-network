const UserController = require('./user')
const PostController = require('./post')
const CommentController = require("./comment");
const LikeController = require("./like");
const FollowController = require("./follow");

module.exports = {
    UserController,
    PostController,
    CommentController,
    LikeController,
    FollowController
}