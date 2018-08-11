# School-Bot

This bot has been created using [Microsoft Bot Framework](https://dev.botframework.com), 

This bot is designed to do the following:

Get university news for a chatbot.

### Dialogs

Each dialog class has three properties to help simplify addition to an existing bot:
- id: Used for the id
- waterfall: The logic (or waterfall) for the dialog
- name: The intent name for the dialog for triggering

You can add a dialog to a bot with the following code:

``` javascript
// declare your dialog

bot.dialog(dialog.id, dialog.waterfall).triggerAction({ matches: dialog.name });
```

By using this structure, it would be possible to dynamically load all of the dialogs in the `dialogs` folder, and then add them to the bot.

## Getting Started

### Configuring the bot

Update `.env` with the appropriate keys:

- KBID and SUBSCRIPTION_KEY for QnA Maker
- LUIS_MODEL_URL for LUIS
- App ID and Key for registered bots.
- PORT

In the case of LUIS, you will need to update the dialog in `dialogs.js` to work with the appropriate intent and entities.

### Running the bot

```
npm start
```

## Additional Resources

- [Microsoft Virtual Academy Bots Course](http://aka.ms/botcourse)
- [Bot Framework Documentation](https://docs.botframework.com)
- [LUIS](https://luis.ai)
- [QnA Maker](https://qnamaker.ai)