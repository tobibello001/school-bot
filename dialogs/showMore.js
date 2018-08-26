module.exports = {
    id: 'showMore',
    name: /^show more/i,
    waterfall: (session) => {
        let { pageNumber, dialogId, args } = session.userData.showMore
        pageNumber++
        session.beginDialog(dialogId, {...args, pageNumber, showMore: true })
    }
}
