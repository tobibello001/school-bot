const { EntityRecognizer } = require('botbuilder')

const { MessageTexts } = require('../helpers/consts')
const utils = require('../helpers/utils')
const PostModel = require('../models/posts')

const options = { id: 'getQueryInfo', pageSize: 10 }

// TODO: Use better means of search engine
// TODO: Decide whether to use latest or trending sort
module.exports = {
    id: options.id,
    name: undefined,
    waterfall: [(session, args, next) => {
        const { entities } = args
        const local_search_query = EntityRecognizer.findEntity(entities, 'local_search_query')
        if (local_search_query) {
            session.dialogData.query = local_search_query.entity
            next()
        } else session.endDialog(MessageTexts.DEFAULT_RESPONSE, utils.getRandomQuery())


    }, async (session) => {
        let { query } = session.dialogData
        let { showMore: { pageNumber = 1 } } = session.userData
        session.sendTyping()
        try {
            let posts = await PostModel
                .find({ title: new RegExp(query, 'i') })
                .skip((pageNumber - 1) * options.pageSize)
                .limit(5)
                .sort('-updated')
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
    }]
}
