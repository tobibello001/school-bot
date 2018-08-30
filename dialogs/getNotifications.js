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
        // (session, results) => {

        // },
        async (session, results) => {

            let { index } = results.response
            let { address } = session.message

            session.sendTyping()
            if (index == 1) {
                return session.endDialog('onConstruction')
            }

            try {
                if (await Notification.findOne({ 'user_address.user.id': address.user.id })) {
                    return session.endDialog(MessageTexts.ALREADY_SUBSCRIBED)
                }
            } catch (err) {
                console.error(err)
            }
            let newNotification = {
                user_address: address,
                type: Menus.NOTIFICATION_OPTIONS[index].id,
            }
            Notification.create(newNotification, err => {
                if (err) {
                    return console.error(err)
                }

                session.endDialog(
                    MessageTexts.LATEST_NOTIFICATION_CREATED
                )
            })
        }
    ]
}