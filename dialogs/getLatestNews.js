const { AttachmentLayout, CardAction, Message, Prompts, ThumbnailCard } = require('botbuilder');

const Post = require('../models/posts');
const { MessageTexts } = require('../helpers/consts');

module.exports = {
    id: 'echo',
    name: 'echo',
    waterfall: (session, results, next) => {
        Post.find()
            .limit(5)
            .sort("-updated")
            .exec((err, res) => {
                let message;

                if (err) {
                    return session.error(err);
                }

                if (res.length === 0) {
                    message = MessageTexts.NO_POSTS;
                } else {
                    const cards = res.map((post) => {
                        return new ThumbnailCard(session)
                            .title(post.title)
                            .subtitle(new Date(post.updated).toDateString())
                            .buttons([CardAction.openUrl(session, post.link, 'Open')]);
                    });

                    message = new Message(session)
                        .attachmentLayout(AttachmentLayout.carousel)
                        .attachments(cards);
                }
                session.endDialogWithResult({ response: message });
            });


    },
};