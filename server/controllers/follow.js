const {  Follows, User, Like} = require('../models')

const FollowController = {
    followUser: async (req, res) => {
       const { followingId } = req.body
       const userId = req.user.id


        if(!followingId) {
            return res.json({ error: 'Following id is required!' })
        }

        if(!followingId === userId) {
            return res.json({ error: 'Follow on yourself not access!' })
        }

        try {
            const existingFollowing = await Follows.findOne({ followerId: userId })

            if (existingFollowing) {
                return res.json({ error: 'Following already created!' })
            }

            const newFollow = await Follows.create({
                followerId: userId ,
                followingId: followingId
            })

            const user = await User.findById(userId)
            const followingUser = await User.findById(followingId)

           if (!user && !followingUser){
               return res.json({ error: 'This user not found!' })
           }

           user.followers.push(newFollow)
            followingUser.following.push(userId)

            await user.save()
            await followingUser.save()

            res.json({newFollow})
        } catch (e) {
            console.log(e)
            res.status(500).json({ error: "Error followUser" })
        }



    },
    unFollowUser: async (req, res) => {
        const followingId = req.params.id
        const userId = req.user.id

        if(!followingId) {
            return res.json({ error: 'Following id is required!' })
        }

        if(!followingId === userId) {
            return res.json({ error: 'Follow on yourself not access!' })
        }

        try {
            const existingFollowing = await Follows.findOne({ followerId: userId })
            const followingUser = await User.findById(followingId)
            const user = await User.findById(userId)

            if (!user){
                return res.json({ error: 'User not found!' })
            }

            await user.followers.pull(existingFollowing._id)
            await user.save()


            if (!followingUser || !existingFollowing) {
                return res.json({ error: 'User not found!' })
            }

            const followerId = existingFollowing._id.toHexString()

            if (followerId === userId) {
                return res.json({ error: 'unFollowing not access!' })
            }

            await Follows.deleteOne({ _id: existingFollowing._id })



            await user.followers.pull(existingFollowing._id)
            await followingUser.following.pull(userId)

            await user.save()
            await followingUser.save()


            res.json('success')
        } catch (e) {
            console.log(e)
            res.status(500).json({ error: "Error followUser" })
        }
    }
}


module.exports = FollowController
