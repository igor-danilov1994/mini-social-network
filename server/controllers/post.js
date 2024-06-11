const { Post, Like, Comment, User} = require("../models");
const { startSession } = require("mongoose");

const PostController = {
    createPost: async (req, res) => {
        const { content } = req.body
        const userId = req.user.id

        if (!content) {
            return res.status(400).json({ error: 'All fields are required!' })
        }

        try {
            const user = await User.findById(userId)

            if (!user){
                return res.status(400).json({ error: 'User not found!' })
            }

            const newPost = await Post.create({
                content: content,
                authorId: userId,
                createdAt: new Date(),
            })

            const postWithLikeInfo = newPost.likes.includes(userId)

            user.posts.push(newPost)
            await user.save()

            res.json({
                content: newPost.content,
                user: newPost.authorId,
                likes: newPost.likes,
                comments: newPost.comments,
                createdAt: newPost.createdAt,
                id: newPost.id,
                likedByUser: postWithLikeInfo
            })
        } catch (e) {
            console.log(e)
            res.status(500).json({ error: 'Error createPost' })
        }
    },
    getAllPosts: async (req, res) => {
        const userId = req.user.id

        try {
            const allPosts = await Post.find().populate(['authorId', 'comments', 'likes'])

            const user = await User.findById(userId)

            if (!user){
                return res.status(400).json({ error: 'User not found!' })
            }

            const postsWithLikeInfo = allPosts.map((post) => {
                const hasLike =  Boolean(post.likes.find(like => like.userId.toString() === userId))

                return {
                    content: post.content,
                    user: post.authorId,
                    likes: post.likes,
                    comments: post.comments,
                    createdAt: post.createdAt,
                    authorId: post.authorId,
                    id: post.id,
                    likedByUser: hasLike
                }
            })

            res.json(postsWithLikeInfo)
        } catch (e) {
            console.log(e)
            res.status(500).json({ error: "Error getAllPosts" })
        }
    },
    getPostById: async (req, res) => {
       const postId = req.params.id
       const userId = req.user.id

        if (!postId) {
            return res.json({ error: "Post id is required!" })
        }

        try {
            const post = await Post.findById(postId)
                .populate('authorId')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'userId',
                        model: 'User'
                    }
                })
                .populate('likes');


            if (!post) {
                return res.status(400).json({ error: 'Post not found!'})
            }
            const hasLike =  Boolean(post.likes.find(like => like.userId.toString() === userId))

            const postWithLikeInfo = {
                authorId: post.authorId,
                comments: post.comments,
                content: post.content,
                createdAt: post.createdAt,
                likes: post.likes,
                id: post._id,
                likedByUser: hasLike
            }

            res.json(postWithLikeInfo)
        } catch (e) {
            console.log(e)
            res.status(500).json({ error: 'Error getPostById' })
        }
    },
    updatePost: async (req, res) => {
        res.send('updatePost')

    },
    deletePost: async (req, res) => {
        const postId = req.params.id
        const userId = req.user.id

        if (!postId) {
            return res.json({ error: "Post id is required!" })
        }

        const session = await startSession();
        session.startTransaction();

        try {
            const post = await Post.findById(postId).populate('authorId', 'likes')

            if (!post) {
                return res.status(400).json({ error: 'This post not found!' })
            }

            const postAuthorId = post.authorId._id.toHexString()

            if (postAuthorId !== userId) {
                return res.json({ error: 'Post id not equal current user id!' })
            }

            await Post.deleteOne({ _id: postId }).session(session)
            await Comment.deleteMany({ postId: postId }).session(session)
            await Like.deleteMany({ postId: postId }).session(session)

            await session.commitTransaction();
            await session.endSession();

            res.json({ message: 'Post was deleted!' })

        } catch (e) {
            console.log(e)
            await session.abortTransaction();
            await session.endSession();
            res.status(500).json({ error: 'Error deletePost' })
        }

    },
}

module.exports = PostController
