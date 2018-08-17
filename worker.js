require('dotenv').config()
const mongoose = require('mongoose')

const utils = require('./helpers/utils')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
        console.log('Connected to database')
    })
    .catch((err) => {
        console.error('Got error connecting to database: ' + err.message)
    })

setInterval(utils.unilagPostsFetch, process.env.NODE_ENV == 'prod' ? 86400000 : 900000)