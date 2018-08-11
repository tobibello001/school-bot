const {
    CardAction,
    ListStyle,
    Message,
    Prompts,
    ThumbnailCard,
} = require('botbuilder');
const mongoose = require('mongoose');
const Post = require('../models/posts');

const { PromptTexts, Menus } = require('../helpers/consts');

module.exports = {
    id: 'root',
    name: 'root',
    waterfall: [
        (session) => {
            Prompts.choice(session, PromptTexts.DEFAULT_RESPONSE, Menus, { listStyle: ListStyle.button })
        },
        (session, results) => {
            const { index } = results.response;
            switch (index) {
                case 0:
                    session.beginDialog('getLatestNews');
            }
        }
    ]
};