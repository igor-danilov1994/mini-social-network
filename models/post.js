const mongoose= require("mongoose");
const { Schema } = mongoose;

const PostSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'Like'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', PostSchema);

