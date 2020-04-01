const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    caption: String,
    img: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    authorName: String,
    likes: {
        type: Number,
        default: 0
    },
    likers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // reaction:
});

module.exports = mongoose.model("Post", PostSchema);