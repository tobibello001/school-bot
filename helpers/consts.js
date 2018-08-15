exports.PromptTexts = {
    HELP: 'What would you like to know?'
}

exports.MessageTexts = {
    CANCEL_HELP: 'Okay, nevermind.',
    EXAMPLE_QUERY: [
        'Show me news about inaugural lectures',
    ],
    GREETINGS: ['Sup?', 'Hi there!', 'Hello!', 'Hey.'],
    GREETING_RESPONSE: '%s Try something like: %s, or type "help".',
    DEFAULT_RESPONSE: 'Oops, I didn\'t get that. Try something like: %s, or type "help".',
    NO_POSTS: 'Oops, Sorry but I got nothing for now. Check back soon.',
}

exports.MenuTexts = ['Latest News']
exports.Menus = {
    HELP_MENU: [
        { title: 'Latest News', dialogId: 'getLastestInfo' },
    ]
}