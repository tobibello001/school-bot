const PostModel = require('../models/posts')
const { MessageTexts } = require('../helpers/consts')
const utils = require('../helpers/utils')

const options = { id: 'getTrendingInfo', pageSize: 10 }

module.exports = {
    id: options.id,
    name: /trending news/i,
    waterfall: async (session) => {
        let { showMore: { pageNumber = 1 } } = session.userData
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
            message = utils.buildNewsCards(session, posts)
            session.userData.showMore = { pageNumber, dialogId: options.id }
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