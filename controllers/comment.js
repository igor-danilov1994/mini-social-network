const { Comment } = require('../models')
const { Post } = require('../models')


const CommentController = {
    createComment: async (req, res) => {
       const { content, postId } = req.body
       const userId = req.user.id

        if (!content || !postId) {
            return res.json({error: 'Contend field is required!'})
        }

        try {
            const newComment = await Comment.create({
                content,
                userId,
                postId: postId
            })

            const post = await Post.findById(postId)

            if (!post){
                return res.json({ error: 'This post not found!' })
            }

            post.comments.push(newComment._id);
            await post.save();

            res.json({
                content: newComment.content,
                commentId: newComment._id,
                userId: newComment.userId,
                postId: newComment.postId,
            })
        } catch (e) {
            console.log(e)
            res.send(500).json({ error: 'Error createComment' })
        }
    },
    deleteComment: async (req, res) => {
        const commentId  = req.params.id
        const userId  = req.user.id

        if (!commentId){
            return res.json({ error: "Comment id is required!" })
        }

        try {
            const comment = await Comment.findById(commentId)

            if(!comment) {
                return res.json({ error: 'Comments not found!' })
            }

            const commentUserId =  comment.userId.toHexString()

            if (commentUserId !== userId) {
                return res.json({ error: 'Not access!' })
            }

            await Comment.deleteOne({_id: commentId})
            res.json({ message: "Comments was deleted!"})
        } catch (e) {
            console.log(e)
            res.status(500).json({ error: "Error with delete comment!"})
        }
    },
}

module.exports = CommentController