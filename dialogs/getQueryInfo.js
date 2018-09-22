const { EntityRecognizer, Message, CardAction, ThumbnailCard } = require('botbuilder')

const { MessageTexts, Menus } = require('../helpers/consts')
const utils = require('../helpers/utils')
const PostModel = require('../models/post')

const options = { id: 'getQueryInfo', pageSize: 10 }

// TODO: Use better means of search engine
module.exports = {
    id: options.id,
    name: undefined,
    waterfall: [
        (session, args, next) => {
            const { entities = [] } = args
            const local_search_query = EntityRecognizer.findEntity(entities, 'local_search_query')
            if (local_search_query) next({ ...args, query: local_search_query.entity })
            else return session.endDialog(MessageTexts.DEFAULT_RESPONSE, utils.getRandomQuery())
        },
        async (session, args) => {
            let { pageNumber = 1, showMore = false, query } = args
            session.sendTyping()
            try {
                let posts = PostModel
                    .find({ title: new RegExp(query, 'i') })
                    .skip((pageNumber - 1) * options.pageSize)
                    .limit(5)
                    .sort('-clicks -lastClicked -updated')

                let message
                message = utils.buildNewsCards((posts = await posts), session)

                session.conversationData.showMore = { args, pageNumber, dialogId: options.id }
                session.send(MessageTexts.HERE_YOU_GO)
                session.endDialog(message)
            } catch (e) {
                if (e instanceof RangeError) {
                    if (showMore) {
                        session.replaceDialog(options.id, args)
                    } else {
                        try {
                            const card = new ThumbnailCard(session)
                                .buttons(
                                    Menus.HELP_MENU
                                        .filter(menuItem => menuItem.type == 'dialog' && menuItem.onNoPost)
                                        .map(menuItem => {
                                            return CardAction.imBack(session, menuItem.msg, menuItem.title)
                                        })
                                )
                            console.log('Foo')
                            const message = new Message(session)
                                .text(MessageTexts.NO_POSTS)
                                .addAttachment(card)
                            // The bot's global action handlers will intercept the tapped button event
                            session.endDialog(message)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                }
                else
                    console.error(e)
            }
        }
    ]
}
