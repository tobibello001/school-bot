const PostModel = require('../models/posts')
const { MessageTexts } = require('../helpers/consts')
const utils = require('../helpers/utils')

module.exports = {
    id: 'getTrendingInfo',
    name: /trending news/i,
    waterfall: async (session) => {
        session.sendTyping()
        let posts = await PostModel.find().skip(0).limit(5).sort('-clicks -lastClicked -updated')
        session.send(MessageTexts.HERE_YOU_GO)
        session.endDialog(utils.buildNewsCards(session, posts))
    },
}