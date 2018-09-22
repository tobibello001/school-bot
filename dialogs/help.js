const { CardAction, Message, ThumbnailCard } = require('botbuilder')
const { PromptTexts, Menus } = require('../helpers/consts')

module.exports = {
    id: 'help',
    name: /^help$/i,
    waterfall: (session) => {
        const card = new ThumbnailCard(session)
            .buttons(Menus.HELP_MENU.map(menuItem => {
                switch (menuItem.type) {
                    case 'dialog':
                        return CardAction.imBack(session, menuItem.msg, menuItem.title)
                    case 'link':
                        return CardAction.openUrl(session, menuItem.link, menuItem.title)
                }
            }))

        const message = new Message(session)
            .text(PromptTexts.HELP)
            .addAttachment(card)

        // The bot's global action handlers will intercept the tapped button event
        session.endDialog(message)
    }
}
