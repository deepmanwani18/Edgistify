const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    caption: String,
    authorName: String,
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    // reaction:
});

module.exports = mongoose.model("Comment", CommentSchema);