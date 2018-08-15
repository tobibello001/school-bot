const { MessageTexts } = require('../helpers/consts');

module.exports = {
    id: 'findInfo',
    name: undefined,
    waterfall: (session) => {
        session.endDialog(MessageTexts.NO_POSTS);
    }
};
