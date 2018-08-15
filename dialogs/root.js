const {
    DialogAction,
    EntityRecognizer,
    IntentDialog,
} = require('botbuilder');

const { MessageTexts } = require('../helpers/consts');

const utils = require('../helpers/utils');

module.exports = new IntentDialog({ recognizers: [utils.witRecognizer] })
    .matches('latest_info', DialogAction.beginDialog('getLatestInfo'))
    .matches('find_info', DialogAction.beginDialog('findInfo'))
    .onDefault((session, args) => {
        // const messageText = session.message.text;
        const { entities } = args;

        // Extract all the useful entities.
        const greeting = EntityRecognizer.findEntity(entities, 'greetings');

        if (greeting)
            session.endDialog(MessageTexts.GREETING_RESPONSE, utils.getRandomGreeting(), utils.getRandomQuery());
        else
            session.endDialog(MessageTexts.DEFAULT_RESPONSE, utils.getRandomQuery());
    });
