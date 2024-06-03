const mongoose= require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: String,
    avatarUrl: String,
    dateOfBirth: String,
    bio: String,
    location: String,
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'Like'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'Follows'
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'Follows'
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
