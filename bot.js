const { Middleware, UniversalBot, ChatConnector } = require('botbuilder')
const mongoose = require('mongoose')
const { MongoBotStorage } = require('botbuilder-storage')

const dialogs = require('./dialogs')

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
bot.dialog(dialogs.findInfo.id, dialogs.findInfo.waterfall)
bot.dialog(dialogs.help.id, dialogs.help.waterfall).triggerAction({ matches: dialogs.help.name})

module.exports = bot
