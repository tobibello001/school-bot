const {
    CardAction,
    DialogAction,
    EntityRecognizer,
    IntentDialog,
    Message,
    ThumbnailCard,
} = require('botbuilder');
const mongoose = require('mongoose');
const Post = require('../models/posts');

const { MessageTexts, MenuTexts } = require('../helpers/consts');

const utils = require('../helpers/utils');

module.exports = new IntentDialog({ recognizers: [utils.witRecognizer] })
    .matches('latest_info', DialogAction.beginDialog('getLatestInfo'))
    .onDefault((session, args) => {
        const messageText = session.message.text;
        const { entities } = args;

        // Extract all the useful entities.
        const greeting = EntityRecognizer.findEntity(entities, 'greetings');
        let card = new ThumbnailCard(session)
            .buttons(MenuTexts.map(menuText => CardAction.imBack(session, menuText, menuText)));
        let message = new Message(session).addAttachment(card);
        if (greeting)
            message.text(MessageTexts.GREETING_RESPONSE, utils.getRandomGreeting());
        else
            message.text(MessageTexts.DEFAULT_RESPONSE)

        session.endDialog(message);
    });
