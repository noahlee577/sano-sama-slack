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


var catfacts = [
                "A group of cats is called a clowder. A group of cool cats is called a Chorale 😘",
                //"Cats have over 20 muscles that control their ears. All straining to hear us sing...",
                "Much like college students, cats sleep 70% of their lives. (I feel attacked)",
                "Cats can’t taste sweetness. Now we know why they don't lick Chorale members more often 😥",
                "Owning a cat can reduce the risk of stroke and heart attack by a third. Singing with Chorale can, too, probably?!",
                //"The world’s richest cat is worth $13 million after his human passed away and left her fortune to him. Still not richer than James' bass notes tho 😉",
                //"Cats make more than 100 different sounds whereas dogs make around 10. Stay tuned for how many sounds Courtney can make while getting her back cracked...",
                //"Hearing is the strongest of cat’s senses: They can hear sounds as high as 64 kHz — compared with humans, who can hear only as high as 20 kHz. That moment when you're suddenly envious of cats while listening to Jin-Hee sing...",
                //"The Egyptian Mau is the oldest breed of cat. Deadmau5 comes close second.",
                "Cats can move their ears 180 degrees. Getting the best seats in the house wherever they are, so lucky!"

              ];

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


app.message(/(sano|steve).*/, async ({ context, say }) => {
  // RegExp matches are inside of context.matches
  // const greeting = context.matches[0];

  var choices = [
                 'Hosano in excelsis',
                 '*messa di voce\'ing intensifies*',
                 ':sassy-sano:',
                 ':master-sano:',
                 //cool(),
                 //'Meet me at MemSquirt',
                 /*
                 '@Jin-Hee ',
                 '@Lily ',
                 '@Seyi ',
                 '@Lauren ',
                 '@Becca ',
                 '@Maya ',
                 '@Julia ',
                 '@Millie ',
                 '@Toby ',
                 '@Maïgane ',
                 '@Esther ',
                 '@Sarah ',
                 '@Diego ',
                 '@Trip ',
                 '@Oscar ',
                 '@Fletcher ',
                 '@Bai-han ',
                 */
                 //'@Minseung can you please share your workout routine. Like dang #zaddy',
                 //'@Ben ',
                 //'@KeeSeok ',
                 //'@Kyle ',
                 //'@Ben ',
                 //'@Kaile ',
                 //'@Akshar ',
                 //'@Zach ',
                 //'@Jeremy',
                 '',
                 'Another reminder to send in anonymous/non-anonymous messages of Chorale shout-outs to yourmanito92@gmail.com! 😊 You can use temporary email address (like 1hr email) for anonymity!',
                 '*plays a sick slack key vamp*',
                 //'*cringing in Hawaiian*',
                 //'*judging in ʻŌlelo Hawaiʻi*',
                 //'Mmmmm that post was so ʻono! nom nom nom',
                 'catfacts_trigger', // Will pick random cat fact
                 'catfacts_trigger', // Mohr kat faxs
                 '',  // empty text will indicate the need for meme-ing ;)
                 '',  // Add a few for increased meme chances
                 '',
                 ''
                ];
  picked_response = choices[Math.floor(Math.random() * choices.length)];

  if (picked_response.match('catfacts_trigger')){
    var cat_intro = [
                     "Everyone needs a cat fact now and again 😜 ",
                     //"You might say, \'wow, Steve is actually hard to meme about\', and you'd be right! So here's a cat fact instead: ",
                     "Did you know... ",
                     "Why make Steve memes when you can read cat facts? ",
                     "And it's time for... random cat facts! ",
                     //"Cat Facts! 😜 ",
                     'Oh my, would you look at the time?! It\'s time for.... a cat fact!! 😜'
                   ];

    var cat_flair = [
                     "Meow! 😺",
                     "Me-woah! 😸",
                     "Me-awww! 😻",
                     "Le Meow 😺",
                     "yeet.",
                     "Stev-eow!",
                     "Aww! 🥺"
                    ];

    await say(cat_intro[Math.floor(Math.random() * cat_intro.length)] + catfacts[Math.floor(Math.random() * catfacts.length)] + ' ' + cat_flair[Math.floor(Math.random() * cat_flair.length)]);
  }

  // if an empty string response is chosen--fill with meme attachment
  // if (!picked_response){
  //   msgAttachment['type'] = 'image';
  //   msgAttachment['url'] = memeLinks[Math.floor(Math.random() * memeLinks.length)];
  //   attachToggle = true;
  // }

  await say(picked_response);
});

app.message(/(hwh[yae]).*/, async ({ context, say }) => {
  // RegExp matches are inside of context.matches
  // const greeting = context.matches[0];
  var choices = ['I\'m loving the hhhhwh in that. thank you 🥰🥰',
                 'F`ing delicious. Thank you for the beautiful hhwwwh. mHWaH'
                ];

  await say(choices[Math.floor(Math.random() * choices.length)]);
});

app.message(/([^h]what|[^h]why|[^h]where).*/, async ({ context, say }) => {
  // RegExp matches are inside of context.matches
  const greeting = context.matches[0];

  if(Math.floor(Math.random() * 4)%3 == 0){
    await say('*H'+greeting);
  }

});

(async () => {
  // Start your app
  await app.start();

  console.log('Steve is online :)');
})();