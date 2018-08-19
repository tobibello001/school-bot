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
        default: 0,
    },
    lastClicked: {
        type: Date,
        default: new Date(0)
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