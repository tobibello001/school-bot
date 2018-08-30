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
    NO_POSTS: 'Oops, Sorry but I couldn\'t find anything.\nTry something else,\nor type "help".',
    NO_NOTIFS: 'You have no notification set',
    SHOW_MORE: 'Show more',
    LATEST_NOTIFICATION_CREATED: 'Alright, I\'ll text you the latest articles as they are published at http://unilag.edu.ng',
    QUERY_NOTIFICATION_CREATED: 'Alright, I\'ll text you the latest articles about %s\nas they are published at http://unilag.edu.ng',
    LATEST_NOTIF_MESSAGE: 'Latest new from http://unilag.edu.ng',
    QUERY_NOTIF_MESSAGE: 'Latest new about %s from http://unilag.edu.ng',
    ALREADY_SUBSCRIBED: 'You have already subscribed to that',
    DONE: 'The notification has been deleted!',
    ALREADY_DELETED:'Already deleted'
}

exports.Menus = {
    HELP_MENU: [
        { title: 'Latest News', msg: 'Latest News', dialogId: 'getLastestInfo' },
        { title: 'Trending News', msg: 'Trending News', dialogId: 'getTrendingInfo' },
        { title: 'Get Notifications', msg: 'Get Notifications', dialogId: 'getNotifications' },
        { title: 'My Notifications', msg: 'Show Notifications', dialogId: 'showNotifications' },
    ],
    NOTIFICATION_OPTIONS: [
        { id: 'latest', title: 'Latest News Notification' },
        { id: 'tailored', title: 'Tailored Notification' }
    ]
}