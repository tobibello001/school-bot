module.exports = {
    id: 'getNotifications',
    name: /notifications/i,
    // TODO: Implement notification feature
    // TODO: allow user to be able to seecify to get notitfications on a particular topic or query
    waterfall: (session) => {
        session.endDialog('On construction') 
    },
}