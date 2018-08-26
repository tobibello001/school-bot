const PostModel = require('../models/posts')
const { MessageTexts } = require('../helpers/consts')
const utils = require('../helpers/utils')

const options = { id: 'getLatestInfo', pageSize: 5 }

module.exports = {
    id: options.id,
    name: /latest news/i,
    waterfall: async (session, args) => {
        let { pageNumber = 1, showMore = false } = args
        session.sendTyping()
        try {
            let postsCount = PostModel
                .find()
                .count()
            let posts = PostModel
                .find()
                .skip((pageNumber - 1) * options.pageSize)
                .limit(options.pageSize)
                .sort('-updated')
            postsCount = await postsCount
            posts = await posts
            let message
            let isLastSet = pageNumber * options.pageSize >= postsCount
            message = utils.buildNewsCards(session, posts, isLastSet)
            session.userData.showMore = { args, pageNumber, dialogId: options.id }
            session.send(MessageTexts.HERE_YOU_GO)
            session.endDialog(message)
        } catch (e) {
            if (e instanceof RangeError) {
                if (showMore) {
                    session.replaceDialog(options.id, { ...args, pageNumber: 1, showMore: false })
                } else {
                    session.endDialog(MessageTexts.NO_POSTS)
                }
            }
            else
                console.error(e)
        }
    },
}
