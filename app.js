"use strict";

const restify = require('restify');
require('dotenv').config();
const mongoose = require('mongoose');

const bot = require('./bot.js');

mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Got error: ' + err.message);
    })

const server = restify.createServer();
server.post('/api/messages', bot.connector('*').listen());
server.listen(process.env.PORT, () => {
    console.log(`${server.name} listening to ${server.url}`);
});