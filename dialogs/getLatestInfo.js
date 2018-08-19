const PostModel = require('../models/posts')
const { MessageTexts } = require('../helpers/consts')
const utils = require('../helpers/utils')

module.exports = {
    id: 'getLatestInfo',
    name: /latest news/i,
    // TODO: Add pagination
    waterfall: async (session) => {
        session.sendTyping()
        let posts = await PostModel.find().skip(0).limit(5).sort('-updated')
        let message
        try {
            message = utils.buildNewsCards(session, posts)
            session.send(MessageTexts.HERE_YOU_GO)
            session.endDialog(message)
        } catch (e) {
            if (e instanceof RangeError)
                session.endDialog(MessageTexts.NO_POSTS)
            else
                console.error(e)
        }
    },
}