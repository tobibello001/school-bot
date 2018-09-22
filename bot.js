const { Middleware, UniversalBot, ChatConnector, Message } = require('botbuilder')
const mongoose = require('mongoose')
const { MongoBotStorage } = require('botbuilder-storage')

const dialogs = require('./dialogs')
const utils = require('./helpers/utils')
const { MessageTexts } = require('./helpers/consts')

const bot = new UniversalBot(
    new ChatConnector({
        appId: process.env.MICROSOFT_APP_ID,
        appPassword: process.env.MICROSOFT_APP_PASSWORD
    }),
    dialogs.root.waterfall
)

bot.use(Middleware.sendTyping())

const connection = mongoose.connection
connection.once('open', () => {
    const adapter = new MongoBotStorage(
        connection.db,
        {
            collection: 'botState',
            ttl: {
                userData: 3600 * 24 * 365,
                conversationData: 3600 * 24 * 7,
                privateConversationData: 3600 * 24 * 7
            }
        }
    )
    bot.set('storage', adapter)
})

bot.dialog('/', dialogs.root)
bot.dialog(dialogs.getLatestInfo.id, dialogs.getLatestInfo.waterfall)
bot.dialog(dialogs.getTrendingInfo.id, dialogs.getLatestInfo.waterfall)
bot.dialog(dialogs.getQueryInfo.id, dialogs.getQueryInfo.waterfall)
bot.dialog(dialogs.getNotifications.id, dialogs.getNotifications.waterfall)
bot.dialog(dialogs.showNotifications.id, dialogs.showNotifications.waterfall)
    .beginDialogAction('deleteNotificationAction', dialogs.deleteNotification.id)
bot.dialog(dialogs.deleteNotification.id, dialogs.deleteNotification.waterfall)
bot.dialog(dialogs.showMore.id, dialogs.showMore.waterfall)
    .triggerAction({ matches: dialogs.showMore.name })
bot.dialog(dialogs.help.id, dialogs.help.waterfall)
    .triggerAction({ matches: dialogs.help.name })

bot.on('conversationUpdate', function (message) {
    // Send a hello message when bot is added
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                var reply = new Message()
                    .address(message.address)
                    .text(
                        MessageTexts.WELCOME_MESSAGE,
                        utils.getRandomQuery()
                    )
                bot.send(reply)
            }
        })
    }
})

setInterval(utils.unilagPostsFetch, process.env.NODE_ENV == 'production' ? 3 * 60 * 60 * 1000 : 5 * 60 * 1000)
setInterval(utils.checkForNewUnilagPosts(bot), process.env.NODE_ENV == 'production' ? 24 * 60 * 60 * 1000 : 5 * 60 * 1000)

module.exports = bot
