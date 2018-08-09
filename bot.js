"use strict";

const builder = require("botbuilder");
const mongoose = require('mongoose');
const { MongoBotStorage } = require('botbuilder-storage');

const dialogs = require("./dialogs");

const bot = new builder.UniversalBot(
    new builder.ChatConnector({
        appId: process.env.MICROSOFT_APP_ID,
        appPassword: process.env.MICROSOFT_APP_PASSWORD
    }),
    dialogs.root.waterfall
);

const connection = mongoose.connection;
connection.once('open', () => {
    const adapter = new MongoBotStorage(
        connection.db,
        {
            collection: "botState",
            ttl: {
                userData: 3600 * 24 * 365,
                conversationData: 3600 * 24 * 7,
                privateConversationData: 3600 * 24 * 7
            }
        }
    )
    bot.set('storage', adapter);
});

module.exports = bot;
