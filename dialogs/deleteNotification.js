const NotificationModel = require('../models/notification')
const { MessageTexts } = require('../helpers/consts')

const options = { id: 'deleteNotification', pageSize: 10 }

module.exports = {
    id: options.id,
    name: undefined,
    waterfall: (session, args) => {
        let notifId = args.data
        session.sendTyping()
        NotificationModel.findByIdAndRemove(notifId, (err, notif) => {
            if (err) return console.error(err)
            if (notif)
                session.endDialog(MessageTexts.DONE)
            else
                session.endDialog(MessageTexts.ALREADY_DELETED)

        })
    },
}