const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    user_address: {
        id: String,
        channelId: String,
        bot: {
            id: String,
            name: String,
            role: String
        },
        conversation: {
            id: String,
            name: String,
            isGroup: Boolean
        },
        user: {
            id: String,
            name: String
        },
        serviceUrl: String,
        useAuth: Boolean
    },
    type: {
        type: String,
        enum: ['latest', 'tailored'],
        required: true
    },
    query: String
})

module.exports = mongoose.model('Notification', NotificationSchema)