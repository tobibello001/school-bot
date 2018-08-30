const request = require('request')
const sanitizeHtml = require('sanitize-html')
const cheerio = require('cheerio')
const chance = require('chance')
const { WitRecognizer } = require('botbuilder-wit')
const { Message, ThumbnailCard, CardAction, CardImage, AttachmentLayout, UniversalBot } = require('botbuilder')

const { MessageTexts, Menus } = require('./consts')
const PostModel = require('../models/post')
const NotificationModel = require('../models/notification')

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

const buildNewsCards = (posts, session, isLastSet = true) => {
    if (!posts.length)
        throw new RangeError('posts.length must be greater than zero')

    const cards = posts.map((post) => {
        let thumbnailCard = new ThumbnailCard(session)
            .title(post.title)
            .subtitle(new Date(post.updated).toDateString())
            .buttons([CardAction.openUrl(session, `${process.env.DOMAIN}/link?url=${post.link}&ref=${post._id}`, 'Open')])

        if (post.imageLink)
            thumbnailCard.images([CardImage.create(session, post.imageLink)])

        return thumbnailCard
    })
    if (!isLastSet) {
        let moreCard = new ThumbnailCard(session)
            .buttons([
                CardAction.imBack(session, MessageTexts.SHOW_MORE, MessageTexts.SHOW_MORE)
            ])
        cards.push(moreCard)
    }

    return new Message(session)
        .attachmentLayout(AttachmentLayout.carousel)
        .attachments(cards)
}
exports.buildNewsCards = buildNewsCards

const buildNotificationCards = (notifs, session, isLastSet = true) => {
    if (!notifs.length)
        throw new RangeError('No Notifications Subscribed')

    const cards = notifs.map(notif => {
        let thumbnailCard = new ThumbnailCard(session)
        switch (notif.type) {
            case 'latest':
                thumbnailCard.title(Menus.NOTIFICATION_OPTIONS[0].title)
                break
            case 'tailored':
                thumbnailCard.title(Menus.NOTIFICATION_OPTIONS[1].title)
                    .subtitle(notif.query)
                break
        }
        thumbnailCard
            .buttons([CardAction.dialogAction(session, 'deleteNotificationAction', notif._id, 'Delete')])
        return thumbnailCard
    })
    if (!isLastSet) {
        let moreCard = new ThumbnailCard(session)
            .buttons([
                CardAction.imBack(session, MessageTexts.SHOW_MORE, MessageTexts.SHOW_MORE)
            ])
        cards.push(moreCard)
    }

    return new Message(session)
        .attachmentLayout(AttachmentLayout.carousel)
        .attachments(cards)
}
exports.buildNotificationCards = buildNotificationCards

exports.checkForNewUnilagPosts = (bot) => {
    if (!(bot instanceof UniversalBot)) {
        throw new Error('Invalid argument: bot must be an instance of UniversalBot.')
    }
    return async () => {
        try {
            let notifs = NotificationModel.find()
            let posts = PostModel.find({ new: true })

            if ((posts = await posts).length == 0) return
            posts.forEach(post => {
                post.new = false
                post.save((err) => {
                    if (err) return console.error(err)
                })
            })

            if ((notifs = await notifs).length == 0) return

            let notifsForLatest = notifs.filter(notif => notif.type == 'latest')
            let messages = []
            messages.push(new Message().text(MessageTexts.LATEST_NOTIF_MESSAGE))
            messages.push(buildNewsCards(posts))
            notifsForLatest.forEach(notif => {
                messages = messages.map(message => {
                    message.address(notif.user_address)
                    return message.toMessage()
                })
                bot.send(messages, (err) => {
                    if (err) return console.error(err)
                })
            })

            let notifsForQuery = notifs.filter(notif => notif.type == 'tailored')
            let notifsClassifiedByQuery = notifsForQuery.reduce((classified, notif) => {
                if (notif.query in classified) {
                    classified[notif.query].push(notif)
                } else {
                    (classified[notif.query] = []).push(notif)
                }
            }, {})
            let queryRelatedPosts
            let messagesForQuery
            for (let query in notifsClassifiedByQuery) {
                queryRelatedPosts = posts.filter(post => post.title.match(new RegExp(query, 'i')))
                messagesForQuery = []
                messagesForQuery.push(new Message().text(MessageTexts.QUERY_NOTIF_MESSAGE))
                messagesForQuery.push(buildNewsCards(queryRelatedPosts))
                notifsClassifiedByQuery[query].forEach(notif => {
                    messagesForQuery = messagesForQuery.map(message => {
                        message.address(notif.user_address)
                        return message.toMessage()
                    })
                    bot.send(messagesForQuery, (err) => {
                        if (err) return console.error(err)
                    })
                })
            }
        } catch (error) {
            return console.error(error)
        }
    }
}

// exports.PostsCarousel = (dialogId, getPostsFunc) => {
//     let pageSize = 1
//     return async (session, args) => {
//         let { queryString = null } = session.dialogData
//         let { pageNumber = 1 } = args
//         session.sendTyping()
//         try {
//             let posts = await getPostsFunc(pageNumber, pageSize, queryString)
//             let message
//             message = buildNewsCards(session, posts)
//             session.conversationData.showMore = { pageNumber, dialogId }
//             session.send(MessageTexts.HERE_YOU_GO)
//             session.endDialog(message)
//         } catch (e) {
//             if (e instanceof RangeError)
//                 session.endDialog(MessageTexts.NO_POSTS)
//             else
//                 console.error(e)
//         }
//     }
// }

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

exports.getRandomQuery = () => {
    return getRandom('query')
}

exports.getRandomGreeting = () => {
    return getRandom('greeting')
}

