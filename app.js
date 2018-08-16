const restify = require('restify')
const mongoose = require('mongoose')
require('dotenv').config()

const bot = require('./bot.js')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
        console.log('Connected to database')
    })
    .catch((err) => {
        console.error('Got error connecting to database: ' + err.message)
    })

const server = restify.createServer()
server.post('/api/messages', bot.connector('*').listen())
server.listen(process.env.PORT, () => {
    console.log(`${server.name} listening to ${server.url}`)
})