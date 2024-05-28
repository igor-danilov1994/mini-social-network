const mongoose= require("mongoose");
const { Schema } = mongoose;

const FollowsSchema = new mongoose.Schema({
    followerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    followingId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Follows', FollowsSchema);