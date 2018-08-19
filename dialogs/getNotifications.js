module.exports = {
    id: 'getNotifications',
    name: /notifications/i,
    waterfall: (session) => {
        session.endDialog('On construction') // TODO: Implement notification feature
    },
}