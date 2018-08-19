exports.PromptTexts = {
    HELP: 'What would you like to know?'
}

exports.MessageTexts = {
    CANCEL_HELP: 'Okay, nevermind.',
    EXAMPLE_QUERY: [
        'Show me news about <what you are looking for e.g lectures>',
        'Give me info about <what you are looking for e.g registration> ',
    ],
    HERE_YOU_GO: 'OK! Here you go.',
    GREETINGS: ['Sup?', 'Hi there!', 'Hello!', 'Hey.'],
    GREETING_RESPONSE: '%s Try something like: %s, or type "help".',
    DEFAULT_RESPONSE: 'Oops, I didn\'t get that. Try something like: %s, or type "help".',
    NO_POSTS: 'Oops, Sorry but I got nothing for now. Check back soon.',
}

exports.MenuTexts = ['Latest News']
exports.Menus = {
    HELP_MENU: [
        { title: 'Latest News', dialogId: 'getLastestInfo' },
        { title: 'Trending News', dialogId: 'getTrendingInfo' },
        { title: 'Get Notifications', dialogId: 'getNotifications' },
    ]
}