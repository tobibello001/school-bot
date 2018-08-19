const request = require('request')
const sanitizeHtml = require('sanitize-html')
const cheerio = require('cheerio')
const chance = require('chance')
const { WitRecognizer } = require('botbuilder-wit')
const { Message, ThumbnailCard, CardAction, CardImage, AttachmentLayout } = require('botbuilder')

const { MessageTexts } = require('./consts')
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
                postDetails.source = 'unilag'
                return postDetails
            })
            // posts.sort((a, b) => b.updated - a.updated)
            resolve(posts)
        })
    })
}
exports.getUnilagNewsPostsOnPage = getUnilagNewsPostsOnPage

exports.getUnilagNewsPostsOnFirstPage = () => {
    return getUnilagNewsPostsOnPage(1)
}

// exports.checkForNewUnilagPosts = (bot) => {
//     if (!(bot instanceof UniversalBot)) {
//         throw new Error('Invalid argument: bot must be an instance of UniversalBot.')
//     }
//     return async () => {
//         // const msg = new Message()
//         //     .text(consts.Messages.REMINDER, reminder.value)

//         PostModel.find({ new: true }, (error, posts) => {
//             if (error) return console.error(error)
//             bot.send(msg, () => {
//                 Reminder.remove({ _id: reminder._id }, err => {
//                     if (err !== null) {
//                         console.error(err)
//                     }
//                 })
//             })
//         }) 
//     }
// }

exports.buildNewsCards = (session, posts) => {
    if (!posts.length)
        throw new RangeError('posts.length must be greater than zero')

    const cards = posts.map((post) => {
        let heroCard = new ThumbnailCard(session)
            .title(post.title)
            .subtitle(new Date(post.updated).toDateString())
            .buttons([CardAction.openUrl(session, `${process.env.DOMAIN}/link?url=${post.link}&ref=${post._id}`, 'Open')])

        if (post.imageLink)
            heroCard.images([CardImage.create(session, post.imageLink)])

        return heroCard
    })

    return new Message(session)
        .attachmentLayout(AttachmentLayout.carousel)
        .attachments(cards)
}

exports.unilagPostsFetch = async () => {
    console.log('started fetching')
    let newPosts, oldPosts, pageNo = 1, hasUniquePost, noOfUniquePosts = 0
    do {
        // Getting posts from page ${pageNo}
        newPosts = await getUnilagNewsPostsOnPage(pageNo)

        // Find post duplicate
        oldPosts = newPosts.map(newPost => {
            return PostModel.findOne({ link: newPost.link })
        })
        for (let i = 0; i < oldPosts.length; i++) {
            oldPosts[i] = await oldPosts[i]
        }

        // check if page ${pageNo} has a new post
        // if it does, go to the next page
        // else stop the fetch
        hasUniquePost = oldPosts.reduce((accumulator, oldPost, index) => {
            if (!oldPost) {
                noOfUniquePosts += 1
                accumulator = true
                let postDoc = new PostModel(newPosts[index])
                postDoc.save(function (err) {
                    if (err) return console.error(err)
                })
            } else if (newPosts[index].updated - oldPost.updated > 0) {
                noOfUniquePosts += 1
                accumulator = true
                for (let field in oldPost) {
                    oldPost[field] = newPosts[index][field]
                }
                oldPost.save(function (err) {
                    if (err) return console.error(err)
                })
            } else {
                if (accumulator === null)
                    accumulator = false
            }
            return accumulator
        }, null)
        pageNo += 1
    } while (hasUniquePost)
    console.log(`${noOfUniquePosts} new posts saved after fetch`)
}

exports.unilagPostsFetchInit = async () => {
    console.log('started init fetching')
    let posts, i = 2, noOfnewPosts = 0
    do {
        posts = await getUnilagNewsPostsOnPage(i++)
        posts.forEach(post => {
            noOfnewPosts += 1
            post.new = false
            let postDoc = new PostModel(post)
            postDoc.save(function (err) {
                if (err) return console.error(err)
            })
        })
    } while (posts.length != 0)
    console.log(`${noOfnewPosts} new posts saved after init fetch`)
}

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
            messages = MessageTexts.GREETINGS
            break
        case 'query':
            messages = MessageTexts.EXAMPLE_QUERY
            break
        default:
            console.error('Unknown entity %s', entity)
    }
    return messages ? chance().pickone(messages) : ''
}
exports.getRandom = getRandom

