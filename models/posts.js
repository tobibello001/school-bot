const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        index: true,
        required: true
    },
    link: {
        type: String,
        required: true,
        index: true
    },
    updated: {
        type: Date,
        index: true,
        required: true
    },
    imageLink: String,
    clicks: {
        type: Number,
        required: true,
        default: 0,
    },
    source: {
        type: String,
        enum: ['unilag'],
        required: true
    },
    new: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('Post', PostSchema)