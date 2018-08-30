const { CardAction, Message, ThumbnailCard } = require('botbuilder')
const { PromptTexts, Menus } = require('../helpers/consts')

module.exports = {
    id: 'help',
    name: /^help$/i,
    waterfall: (session) => {
        const card = new ThumbnailCard(session)
            .buttons(Menus.HELP_MENU.map(menuItem => CardAction.imBack(session, menuItem.title, menuItem.title)))

        const message = new Message(session)
            .text(PromptTexts.HELP)
            .addAttachment(card)

        // The bot's global action handlers will intercept the tapped button event
        session.endDialog(message)
    }
}
