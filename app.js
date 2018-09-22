const restify = require('restify')
const mongoose = require('mongoose')
require('dotenv').config()

const PostModel = require('./models/post')
const bot = require('./bot.js')
const utils = require('./helpers/utils')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, autoIndex: false })
    .then(() => {
        console.log('Connected to database')
    })
    .catch((err) => {
        console.error('Got error connecting to database: ' + err.message)
    })

const server = restify.createServer()
server.use(restify.plugins.queryParser())
server.post('/api/messages', bot.connector('*').listen())

// TODO: Find a more secure means of counting clicks
// TODO: User should be able to get downloadables
server.get('/link', async (req, res, next) => {
    let { url, ref } = req.query
    res.redirect(301, url, next)
    PostModel.findById(ref, (err, post) => {
        if (err) return console.error(err)
        post.clicks += 1
        post.lastClicked = new Date()
        post.save((err) => {
            if (err) return console.error(err)
        })
    })
    
})

server.listen(process.env.PORT, () => {
    console.log(`${server.name} listening to ${server.url}`)
})

setInterval(utils.unilagPostsFetch, process.env.NODE_ENV == 'production' ? 3 * 60 * 60 * 1000 : 5 * 60 * 1000)