const NotificationModel = require('../models/notification')
const { MessageTexts } = require('../helpers/consts')
const utils = require('../helpers/utils')

const options = { id: 'showNotifications', pageSize: 10 }

module.exports = {
    id: options.id,
    name: undefined,
    waterfall: async (session, args) => {
        if (!args) {
            return session.reset('/')
        }
        let { pageNumber = 1, showMore = false } = args
        console.log('****',args)
        let { address } = session.message
        try {
            session.sendTyping()
            let notifsCount = NotificationModel
                .find()
                .countDocuments()
            let notifs = NotificationModel
                .find({ 'user_address.user.id': address.user.id })
                .skip((pageNumber - 1) * options.pageSize)
                .limit(options.pageSize)
            let message
            let isLastSet = pageNumber * options.pageSize >= (notifsCount = await notifsCount)
            message = utils.buildNotificationCards((notifs = await notifs), session, isLastSet)
            session.conversationData.showMore = { args, pageNumber, dialogId: options.id }
            session.send(message)
        } catch (e) {
            if (e instanceof RangeError) {
                if (showMore) {
                    session.replaceDialog(options.id, args)
                } else {
                    session.endDialog(MessageTexts.NO_NOTIFS)
                }
            }
            else
                console.error(e)
        }
    },
}
