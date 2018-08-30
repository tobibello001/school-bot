const { ListStyle, Prompts } = require('botbuilder')

const Notification = require('../models/notification')
const { MessageTexts, Menus } = require('../helpers/consts')

module.exports = {
    id: 'getNotifications',
    name: /notifications/i,
    // TODO: allow user to be able to specify to get notitfications on a particular topic or query
    // TODO: Users should be able to view notifications
    // TODO: Users should be able to manage notifications
    waterfall: [
        (session) => {
            Prompts.choice(
                session,
                'Which type?',
                Menus.NOTIFICATION_OPTIONS.map(option => option.title).join('|'),
                { listStyle: ListStyle.button }
            )
        },
        (session, results, next) => {
            let { index } = results.response

            let type = Menus.NOTIFICATION_OPTIONS[index].id
            session.dialogData.type = type
            if (type == 'tailored') {
                Prompts.text(session, 'What do you want to informed about?')
            } else next()
        },
        async (session, results) => {
            let query
            if (results.response) {
                query = results.response
            } else query = null
            let { address } = session.message
            let { type } = session.dialogData

            session.sendTyping()
            try {
                if (type == 'latest' && await Notification.findOne({ 'user_address.user.id': address.user.id, type })
                    || type == 'tailored' && await Notification.findOne({ 'user_address.user.id': address.user.id, type, query }))
                    return session.endDialog(MessageTexts.ALREADY_SUBSCRIBED)
            } catch (err) {
                console.error(err)
            }
            let newNotification = {
                user_address: address,
                type,
                query
            }
            Notification.create(newNotification, err => {
                if (err) {
                    return console.error(err)
                }
                switch (type) {
                    case 'latest':
                        session.endDialog(MessageTexts.LATEST_NOTIFICATION_CREATED)
                        break
                    case 'tailored':
                        session.endDialog(MessageTexts.QUERY_NOTIFICATION_CREATED, query)
                        break
                }

            })
        }
    ]
}