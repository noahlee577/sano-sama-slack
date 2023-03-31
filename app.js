const { App } = require('@slack/bolt');

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

const catfacts = [
  "A group of cats is called a clowder. A group of cool cats is called a Chorale 😘",
  //"When cats climb a tree, they can't go back down it head first. This is because their claws are facing the same way, instead, they have to go back down backward.",
  //"Cats have over 20 muscles that control their ears. All straining to hear us sing...",
  "Much like college students, cats sleep 70% of their lives. (I feel attacked)",
  '"The Hungarian word for "quotation marks," macskaköröm, literally translates to "cat claws."',
  "Cats can’t taste sweetness. Now we know why they don't lick Chorale members more often 😥",
  "Owning a cat can reduce the risk of stroke and heart attack by a third. Singing with Chorale can, too, probably?!",
  "The world’s richest cat is worth $13 million after his human passed away and left her fortune to him. Still not richer than Akshar's bass notes tho 😉",
  //"Cats make more than 100 different sounds whereas dogs make around 10. Stay tuned for how many sounds Courtney can make while getting her back cracked...",
  "Hearing is the strongest of cat’s senses: They can hear sounds as high as 64 kHz — compared with humans, who can hear only as high as 20 kHz. That moment when you're suddenly envious of cats while listening to Jin-Hee sing...",
  //"The Egyptian Mau is the oldest breed of cat. Deadmau5 comes close second.",
  //"In Holland’s embassy in Moscow, Russia, the staff noticed that the two Siamese cats kept meowing and clawing at the walls of the building. Their owners finally investigated, thinking they would find mice. Instead, they discovered microphones hidden by Russian spies. The cats heard the microphones when they turned on. Instead of alerting the Russians that they found said microphones, they simply staged conversations about delays in work orders and suddenly problems were fixed much quicker!",
  //"The oldest cat video dates back to 1894 and is called 'Boxing Cats'",
  //"The oldest cat to ever live was Creme Puff, who lived to be 38 years and 3 days old.",
  //"The more you talk to your cat, the more it will talk to you.",
  //"Nikola Tesla was inspired to investigate electricity after his cat, Macak, gave him a static shock.",
  //"Isaac Newton invented the cat flap after his own cat, Spithead, kept opening the door and spoiling his light experiments.",
  //"It was considered a capital offense to kill a cat in ancient Egypt.",
  "Purring actually improves bone density and promotes healing within a cat. The purring frequency — 26 Hertz — apparently aides in tissue regeneration and can help stimulate the repair of weak and brittle bones. Explains why Kaile's low notes are so healing 🤤",
  "Cats involuntarily open their mouths after smelling something, tbh I do the same when I hear Julia sing 😲",
  "The world's largest domestic cat is a Maine Coon cat named Stewie, who measures an astounding 48.5 inches long. Still not as tall as Kyle tho 😎",
  'A female cat is called a “molly” or a “queen.” yassssss',
  "A cat’s heart beats nearly twice as fast as a human's heart. :heartbeat:",
  "Cats are responsible for the decimation of 33 different animal species, and they kill around 2.4 million birds a year. :meow_knife: Sorry Maya :meow-reachcry::dove_of_peace:",
  "Cats actually CAN be loyal. A cat named Toldo was renowned in the village of Montagnana, Italy, for visiting his owner's grave every day for a year after he died. ALMOST as loyal as Toby is to staying in Chorale :100_ani::respect:",
  "Cats can move their ears 180 degrees. Getting the best seats in the house wherever they are, so lucky!"
];

const memeLinks = [
  'https://i.groupme.com/640x427.jpeg.508232616c66438a999de11438c4047c', // It was me, Steve!
  'https://i.groupme.com/580x557.jpeg.48b980efe8fb434d9ab619c2454ded7c', // "Good one lol"
  'https://i.groupme.com/580x557.jpeg.3606a48cd2ef4ab2a1fae63cd36d3d62', // mfw someone posts on GroupMe
  'https://i.groupme.com/1331x1996.jpeg.57011624684a41cfa90c2e8da5240378.large', // yummy voices
  'https://i.groupme.com/2048x1366.jpeg.1aafacaebe1c49599a67d03c7a48b5e8' //wholesome meme
];

// https://slack-files.com/T7SAV7LAD-F048AJHC0GP-483be130fa // link to THAT'S IT

// a life test
app.message(/(aloha).*/i, async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  const choices = [`Aloha <@${message.user}>!`,
    `Hey hey <@${message.user}>!`
  ];

  await say(choices[Math.floor(Math.random() * choices.length)]);
});

app.message(/(sano|steve).*/i, async ({ message, say }) => {
  if (message.user != "USLACKBOT") {
    const choices = [
      'Hosano in excelsis',
      '*messa di voce\'ing intensifies*',
      ':sassy-sano:',
      ':master-sano:',
      ':\'ssup:',
      ':acoustic_guitar::acoustic_guitar::acoustic_guitar:',
      'I wanna be _vibin_ :catjam: in :hawaii:',
      'it me ya fav boi treble reportin in',
      'accent that messa di voce button',
      'ope let me slack key vamp right past ya',
      'hippity hoppity Chorale memes are quality',
      ':blobcatglowsticks: Go Chorale go! :blobcatglowsticks:',
      `:boba1::boba2:\n:boba3::boba4:\n:boba5::boba6:`,
      'THAT\'S IT!!!',
      ':10_10:',
      ':resitas:',
      ':cooldoge:',
      ':tobu:',
      ':amaze:',
      ':dicaprio_laugh:',
      ':bear_roll:',
      '@Trip ya might want to see a doctor for all those :shaking-eyes: reaccs... :lizard-hehehehe:',
      ':0_0:',
      'Another random shout-out to our lovely social chairs for bringing us closer :meow_heart::cat-meow-hearts::heart::heart::heart:',
      ':exploding_head: when the basses hit that low D :mindblown::weary::sweat_drops::walter-faint:',
      'Friendship ended with GroupMe, now Slack is my best friend',
      //cool(),
      //'Meet me at MemSquirt',
      '',
      'Another reminder to send in anonymous/non-anonymous messages of Chorale shout-outs to yourmanito92@gmail.com! 😊 You can use temporary email address (like 1hr email) for anonymity!',
      '*plays a sick slack key vamp*',
      //'*cringing in Hawaiian*',
      //'*judging in ʻŌlelo Hawaiʻi*',
      //'Mmmmm that post was so ʻono! nom nom nom',
      'catfacts_trigger', // Will pick random cat fact
      'catfacts_trigger', // Mohr kat faxs
      'catfacts_trigger', // Mohrrr kat faxs
      'catfacts_trigger', // Mohrrrrrr kat faxs
      '', // empty text will indicate the need for meme-ing ;)
      '', // Add a few for increased meme chances
      ''
    ];
    var picked_response = choices[Math.floor(Math.random() * choices.length)];

    if (picked_response.match('catfacts_trigger')) {
      const cat_intro = [
        "Everyone needs a cat fact now and again 😜 ",
        //"You might say, \'wow, Steve is actually hard to meme about\', and you'd be right! So here's a cat fact instead: ",
        "Did you know... ",
        "Why make Steve memes when you can read cat facts? ",
        "And it's time for... random cat facts! ",
        //"Cat Facts! 😜 ",
        "It's meow time~ ",
        ':meow_knife: more katfax or else... ',
        'Oh my, would you look at the time?! It\'s time for.... a cat fact!! 😜 '
      ];

      const cat_flair = [
        "Meow! 😺",
        "Me-woah! 😸",
        "Me-awww! 😻",
        "Le Meow 😺",
        "yeet.",
        "Stev-eow!",
        ":meow_floof_pat:",
        ":meow-dj:",
        ":meow-bongotap:",
        ":cat_keyboard:",
        "Aww! 🥺"
      ];

      await say(cat_intro[Math.floor(Math.random() * cat_intro.length)] +
      catfacts[Math.floor(Math.random() * catfacts.length)] + ' ' +
      cat_flair[Math.floor(Math.random() * cat_flair.length)]);
    }
    //if an empty string response is chosen--fill with meme attachment
    else if (!picked_response) {
      await say({ blocks: [{
          "type": "image",
          "title": {
            "type": "plain_text",
            "text": "yaet"
          },
          "block_id": "mememes",
          "image_url": memeLinks[Math.floor(Math.random() * memeLinks.length)],
          "alt_text": "yeet"
        }]});
    }
    // else it's a plaintext
    else {
      await say(picked_response);
    }
    console.log(`Responded to message from ${message.user}`);
  }
});

app.message(/(h[\S]{0,1}wh[yae]).*/i, async ({ message, say }) => {
  if (message.user != "USLACKBOT") {
    // RegExp matches are inside of context.matches
    // const greeting = context.matches[0];
    const choices = ['I\'m loving the hhhhwh in that. thank you 🥰🥰',
      'F`ing delicious. Thank you for the beautiful hhwwwh. mHWaH',
      `You just made my day <@${message.user}>! thank you :cat-meow-hearts:`
    ];

    await say(choices[Math.floor(Math.random() * choices.length)]);
    console.log(`Responded to message from ${message.user}`);
  }
});

app.message(/([^h]what)/i, async ({ message, say }) => {
  if (message.user != "USLACKBOT") {
    if (Math.floor(Math.random() * 4) % 3 == 0) {
      await say('*Hwhat');
    }

    console.log(`Responded to message from ${message.user}`);
  }
});

app.message(/([^h]why)/i, async ({ message, say }) => {
  if (message.user != "USLACKBOT") {
    if (Math.floor(Math.random() * 4) % 3 == 0) {
      await say('*Hwhy');
    }

    console.log(`Responded to message from ${message.user}`);
  }
});


app.message(/([^h]when)/i, async ({ message, say }) => {
  if (message.user != "USLACKBOT") {
    if (Math.floor(Math.random() * 4) % 3 == 0) {
      await say('*Hwhen');
    }

    console.log(`Responded to message from ${message.user}`);
  }
});

app.message(/([^h]where)/i, async ({ message, say }) => {
  if (message.user != "USLACKBOT") {
    if (Math.floor(Math.random() * 4) % 3 == 0) {
      const roll = Math.floor(Math.random() * 5) % 4;

      if (roll == 0) {
        await say('*Hwhere');
      } else if (roll == 1) {
        await say('*Hwhere is the Hay?');
      } else if (roll == 2) {
        await say('*Hwhere is the Blush?');
      } else {
        await say('*Hwhere is the Bee?');
      }
    }

    console.log(`Responded to message from ${message.user}`);
  }
});


// yes
app.message(/(messa di voce).*/i, async ({ message, say }) => {
  var choices = ['I know I bring up messa di voce a lot, but now get ready for the reverse messa di voce: >.<',
    'messa di voce had me like >.<',
    ':amaze: when that messa di voce hits :amaze:',
    'YES MESSA DI VOCE THAT LIKE BUTTON :likeitalian:'
  ];

  await say(choices[Math.floor(Math.random() * choices.length)]);
  console.log(`Responded to message from ${message.user}`);

});


// yes
app.message(/(boba).*/i, async ({ message, say }) => {
  const choices = [":boba1::boba2:\n:boba3::boba4:\n:boba5::boba6:",
    "BOBAAAAAA",
    ":boba:",
    ":bobacat:",
    ":bobaparrot:"
  ];
  await say(choices[Math.floor(Math.random() * choices.length)]);

  console.log(`Responded to message from ${message.user}`);

});


// test case
app.message(/(test_invoke).*/i, async ({ message, say }) => {
  const choices = [
    `:boba1::boba2:\n:boba3::boba4:\n:boba5::boba6:`,
    'THAT\'S IT!!!',
    ':10_10:',
    ':resitas:',
    ':cooldoge:',
    ':tobu:',
    ':amaze:',
    ':dicaprio_laugh:',
    ':bear_roll:',
    '@Trip ya might want to see a doctor for all those :shaking-eyes: reaccs... :lizard-hehehehe:',
    ':0_0:',
    'Another random shout-out to our lovely social chairs for bringing us closer :meow_heart::cat-meow-hearts::heart::heart::heart:',
    ':exploding_head: when the basses hit that low D :mindblown::weary::sweat_drops::walter-faint:',
    'Friendship ended with GroupMe, now Slack is my best friend'
  ];
  var picked_response = choices[Math.floor(Math.random() * choices.length)];
  await say(picked_response);

  console.log(`Responded to message from ${message.user}`);

});

// boy treble
app.message(/(boy treble).*/i, async ({ message, say }) => {
  var choices = ['Boy treble, you say; oh boy oh boy let me tell you all about my life as a boy treble',
    'ope let me boy treble right past ya',
    'hippity hoppity boi treble in your area',
    'it\'s me, ya fav boi treble'
  ];

  await say(choices[Math.floor(Math.random() * choices.length)]);
  console.log(`Responded to message from ${message.user}`);

});

// NO UWU ALLOWED
app.message(/(uwu).*/i, async ({ message, say }) => {
  const choices = ['NO UWU\'ING ALLOWED IN THIS GROUP',
    `...u...uwu ${message.user}`,
    `${message.user} your weeb is showing!`,
    'Senpai will never notice you! 😤😤',
    'THE ONLY ACCEPTABLE WEEBSPEAK IN THIS GROUP IS >.< AND ONLY BECAUSE IT\'S A REVERSE MESSA DI VOCE!!'
  ];

  await say(choices[Math.floor(Math.random() * choices.length)]);
  console.log(`Responded to message from ${message.user}`);

});

app.event('app_mention', async ({ event, context, client, say }) => {
  try {
    await say(`Waaaazzaahhp <@${event.user}> :catjam:`);
  } catch (error) {
    console.error(error);
  }
});

app.command('/aloha', async ({ command, ack, respond }) => {
  // Acknowledge command request
  await ack();
  await respond(`Aloha!!`);
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  await app.client.chat.postMessage({
    channel: "C02JCT9DCLS",
    text: "Steve is alive!"
  });
  console.log('Steve is online :)');
})();
