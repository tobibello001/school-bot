const PostModel = require('../models/post')
const { MessageTexts } = require('../helpers/consts')
const utils = require('../helpers/utils')

const options = { id: 'getTrendingInfo', pageSize: 10 }

module.exports = {
    id: options.id,
    name: /trending news/i,
    waterfall: async (session, args) => {
        let { pageNumber = 1, showMore = false } = args
        session.sendTyping()
        try {
            let millisecondsInAMonth = 2592000000
            let millisecondsInADay = 86400000
            let posts = await PostModel
                .find({ updated: { $gt: new Date(Date.now() - (new Date(Date.now() - millisecondsInAMonth).getDate() * millisecondsInADay + millisecondsInAMonth)) } })
                .skip((pageNumber - 1) * options.pageSize)
                .limit(5)
                .sort('-clicks -lastClicked -updated')
            let message
            message = utils.buildNewsCards(posts, session)
            session.conversationData.showMore = { args, pageNumber, dialogId: options.id }
            session.send(MessageTexts.HERE_YOU_GO)
            session.endDialog(message)
        } catch (e) {
            if (e instanceof RangeError) {
                if (showMore) {
                    session.replaceDialog(options.id, args)
                } else {
                    session.endDialog(MessageTexts.NO_POSTS)
                }
            }
            else
                console.error(e)
        }
    },
}