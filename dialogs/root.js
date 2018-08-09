const builder = require('botbuilder');

const consts = require('../helpers/consts');

module.exports = {
    id: 'echo',
    name: 'echo',
    waterfall: [
        (session, args, next) => {
            const card = new builder.ThumbnailCard(session)
                .buttons(consts.Menus.help.map(el => builder.CardAction.imBack(session, el.title, el.title)));

            const message = new builder.Message(session)
                .text(consts.Prompts.HELP)
                .addAttachment(card);

            // The bot's global action handlers will intercept the tapped button event
            session.endDialog(message);
        },
        (session, args, next) => {
            const card = new builder.ThumbnailCard(session)
                .buttons(consts.Menus.help.map(el => builder.CardAction.imBack(session, el.title, el.title)));

            const message = new builder.Message(session)
                .text(consts.Prompts.HELP)
                .addAttachment(card);

            // The bot's global action handlers will intercept the tapped button event
            session.endDialog(message);
        },
    ]
};