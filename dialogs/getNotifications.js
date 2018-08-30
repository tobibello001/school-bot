const { ListStyle, Prompts } = require('botbuilder')

const Notification = require('../models/notification')
const { MessageTexts, Menus } = require('../helpers/consts')

module.exports = {
    id: 'getNotifications',
    name: /notifications/i,
    // TODO: Implement notification feature
    // TODO: allow user to be able to specify to get notitfications on a particular topic or query
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
                    return session.endDialog('You have already subscribed to get latest news notifications')
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