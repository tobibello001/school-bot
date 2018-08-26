const PostModel = require('../models/posts')
const { MessageTexts } = require('../helpers/consts')
const utils = require('../helpers/utils')

const options = { id: 'getTrendingInfo', pageSize: 5 }

module.exports = {
    id: options.id,
    name: /trending news/i,
    // TODO: limit trends to a certain time in the past
    waterfall: async (session) => {
        let { showMore: { pageNumber = 1 } } = session.userData
        session.sendTyping()
        try {
            let posts = await PostModel
                .find()
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