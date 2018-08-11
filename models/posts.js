const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: String,
    link: {
        type: String,
        index: true
    },
    updated: {
        type: Date,
        index: true
    },
    imageLink: String
});

module.exports = mongoose.model('Post', PostSchema);