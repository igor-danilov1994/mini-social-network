const { Comment, Post, Like } = require('../models')
const { startSession } = require("mongoose");

const LikeController = {
    likePost: async (req, res) => {
        const { postId } = req.body
        const userId = req.user.id

        if (!postId){
            return res.json({ error: 'Post id is required!' })
        }

        try {
            const like = await Like.findOne({ postId: userId })

            if (like) {
                return res.status(400).json({ error: 'Like already has create!' })
            }

            const newLike = await Like.create({
                userId,
                postId,
            })

            if (!postId) {
                return res.json({ error: 'Post not found!' })
            }

            const post = await Post.findById(postId)


            post.likes.push(newLike)
            await post.save();

            res.json(newLike)
        } catch (e) {
            console.log(e)
            res.status(500).json({ error: 'Error with likePost' })
        }

    },
    unLikePost: async (req, res) => {
        const likeId = req.params.id
        const userId = req.user.id

        const session = await startSession();
        session.startTransaction();

        try {
            const like = await Like.findOne({postId : likeId})

            if (!like) {
                return res.status(400).json({ error: 'Like not found!' })
            }

            const likeUserId =  like.userId.toHexString()

            if (likeUserId !== userId) {
                return res.json({ error: 'Not access!' })
            }

            await Like.deleteOne({ postId: likeId }).session(session);

            const post = await Post.findById(like.postId).session(session);

            if (post) {
                post.likes.pull(likeId);
                await post.save({ session });
            }

            await session.commitTransaction();
            await session.endSession();

            res.json({ message: 'Like was deleted!' })

        } catch (e) {
            console.log(e)
            res.status(500).json({ error: 'Error unLikePost' })
        }
    },
}

module.exports = LikeController
