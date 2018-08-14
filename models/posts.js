const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        index: true
    },
    link: String,
    updated: {
        type: Date,
        index: true
    },
    imageLink: String
});

module.exports = mongoose.model('Post', PostSchema);