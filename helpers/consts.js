exports.PromptTexts = {
    HELP: 'What can i help you with?'
}

exports.MessageTexts = {
    CANCEL_HELP: 'Okay, nevermind.',
    EXAMPLE_QUERY: [
        'Show me news about <what you are looking for e.g lectures>',
        'Give me info about <what you are looking for e.g registration>',
    ],
    HERE_YOU_GO: 'OK! Here you go.',
    GREETINGS: ['Sup?', 'Hi there!', 'Hello!', 'Hey.'],
    GREETING_RESPONSE: '%s\nTry something like:\n"%s",\nor type "help".',
    NO_POSTS: 'Oops, Sorry but I couldn\'t find anything.',
    NO_MORE_POSTS: 'Oops, Sorry but I couldn\'t find anything.',
    SHOW_MORE:'Show more'
}

exports.MenuTexts = ['Latest News']
exports.Menus = {
    HELP_MENU: [
        { title: 'Latest News', dialogId: 'getLastestInfo' },
        { title: 'Trending News', dialogId: 'getTrendingInfo' },
        { title: 'Get Notifications', dialogId: 'getNotifications' },
    ]
}