const request = require('request')
const sanitizeHtml = require('sanitize-html')
const cheerio = require('cheerio')
const chance = require('chance')
const { WitRecognizer } = require('botbuilder-wit')

const consts = require('./consts')
const PostModel = require('../models/posts')

exports.witRecognizer = new WitRecognizer(process.env.WIT_ACCESS_TOKEN)
exports.witClient = exports.witRecognizer.witClient

const getUnilagNewsPostsOnPage = (pageNo) => {
    return new Promise((resolve, reject) => {
        let url = `https://unilag.edu.ng/news/${pageNo > 1 ? `page/${pageNo}/` : ''}`
        request(url, (err, response, body) => {

            if (err) reject(err)

            let cleanHtml = sanitizeHtml(body, { allowedAttributes: false, allowedTags: false })

            let filtered
            filtered = sanitizeHtml(cleanHtml, {
                allowedTags: [...sanitizeHtml.defaults.allowedTags, 'h1', 'h2', 'img', 'body', 'span'],
                allowedClasses: { 'h2': ['entry-title'], 'div': ['post', 'fusion-post-content-container'], 'span': ['updated'] },
            })

            let $ = cheerio.load(filtered)

            let htmlOFPosts = []
            $('div.post').each((i, ele) => {
                let dhtml = $(ele).html()
                htmlOFPosts.push(dhtml)
            })

            let posts = htmlOFPosts.map(value => {
                let postDetails = {}
                $ = cheerio.load(value)
                postDetails.title = $('h2.entry-title a').text()
                postDetails.link = $('h2.entry-title a').attr('href')
                postDetails.imageLink = $('img').attr('src') || null
                // postDetails.shortDescription = $('div.fusion-post-content-container p').text()
                postDetails.updated = new Date($('span.updated').text())
                postDetails.clicks = 0
                postDetails.source = 'unilag'
                return postDetails
            })
            posts.sort((a, b) => b.updated - a.updated)
            resolve(posts)
        })
    })
}
exports.getUnilagNewsPostsOnPage = getUnilagNewsPostsOnPage

exports.getUnilagNewsPostsOnFirstPage = () => {
    return getUnilagNewsPostsOnPage(1)
}

const fetchAllUnilagNews = async () => {
    let posts, i = 1
    do {
        console.log(`Getting posts from page ${i}`)
        posts = await getUnilagNewsPostsOnPage(i++)
        console.log(`Done getting posts from page ${i - 1}`)
        posts.forEach(post => {
            console.log(`Saving ${post.title}`)
            let postDoc = new PostModel(post)
            postDoc.save(function (err) {
                if (err) return console.error(err)
                console.log(`${postDoc.title} Saved`)
            })
        })
    } while (posts.length != 0)
}
exports.fetchAllUnilagNews = fetchAllUnilagNews

exports.getRandomQuery = () => {
    return getRandom('query')
}

exports.getRandomGreeting = () => {
    return getRandom('greeting')
}

const getRandom = (entity) => {
    let messages

    switch (entity) {
        case 'greeting':
            messages = consts.MessageTexts.GREETINGS
            break
        case 'query':
            messages = consts.MessageTexts.EXAMPLE_QUERY
            break
        default:
            console.error('Unknown entity %s', entity)
    }
    return messages ? chance().pickone(messages) : ''
}
exports.getRandom = getRandom

