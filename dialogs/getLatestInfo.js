const { AttachmentLayout, CardAction, CardImage, Message, ThumbnailCard } = require('botbuilder');

const Post = require('../models/posts');
const { MessageTexts } = require('../helpers/consts');

module.exports = {
    id: 'getLatestInfo',
    name: /latest news/i,
    waterfall: (session) => {
        Post.find()
            .limit(5)
            .sort('-updated')
            .exec((err, res) => {
                let message;

                if (err) {
                    return session.error(err);
                }

                if (res.length === 0) {
                    message = MessageTexts.NO_POSTS;
                } else {
                    const cards = res.map((post) => {
                        let heroCard = new ThumbnailCard(session)
                            .title(post.title)
                            .subtitle(new Date(post.updated).toDateString())
                            .buttons([CardAction.openUrl(session, post.link, 'Open')]);

                        if (post.imageLink)
                            heroCard.images([CardImage.create(session, post.imageLink)]);

                        return heroCard;
                    });

                    message = new Message(session)
                        .attachmentLayout(AttachmentLayout.carousel)
                        .attachments(cards);
                }
                session.send(message);
                session.endDialog();
            });
    },
};