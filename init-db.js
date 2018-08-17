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

utils.unilagNewsFetchInit()
    .then(() => {
        mongoose.disconnect((error) => {
            if (error) return console.error(error)
            console.log('Disconnected from database')
        })
    })
