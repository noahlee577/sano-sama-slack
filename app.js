const { App } = require('@steve');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  // Socket Mode doesn't listen on a port, but in case you want your app to respond to OAuth,
  // you still need to listen on some port!
  port: process.env.PORT || 3000
});

var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;


var memeLinks = [
                  'https://i.groupme.com/640x427.jpeg.508232616c66438a999de11438c4047c', // It was me, Steve!
                  'https://i.groupme.com/580x557.jpeg.48b980efe8fb434d9ab619c2454ded7c',   // "Good one lol"
                  'https://i.groupme.com/580x557.jpeg.3606a48cd2ef4ab2a1fae63cd36d3d62', // mfw someone posts on GroupMe
                  'https://i.groupme.com/1331x1996.jpeg.57011624684a41cfa90c2e8da5240378.large', // yummy voices
                  //'https://i.groupme.com/1280x960.jpeg.8fdfc73541d749fdb26802c9fa0a1c9d.large', // Counting days until reunion
                  'https://i.groupme.com/2048x1366.jpeg.1aafacaebe1c49599a67d03c7a48b5e8' //wholesome meme
                ];

var msgAttachment = {
                       type: '',
                       url: ''
                     };

var attachToggle = false; //Whether to post an attachment or not




app.message(/^(hi|hello|hey).*/, async ({ context, say }) => {
  // RegExp matches are inside of context.matches
  const greeting = context.matches[0];

  await say(`${greeting}, how are you?`);
});

(async () => {
  // Start your app
  await app.start();

  console.log('Steve is online :)');
})();
