require('dotenv').config()

const SlackBot = require('slackbots');
const axios = require("axios");

const bot = new SlackBot({
  token: process.env.TOKEN,
  name: "valborg_bot"
});

bot.on('start', () => {
});

//  this part listens for messages on the channel
bot.on('message', (message) => {
  if (Object.keys(message).includes("client_msg_id")) {
    const messages_array = message.text.split(" ")
    const mess = message.text
    if (message.text.includes("valborg")) {
      bot.postMessageToChannel('random', mess)
    }
  }
})

// error handler
bot.on('error', (err) => console.log(err));

// message handler
bot.on('message', data => {
  if (data.type !== 'message') {
    return;
  }
  console.log(data.text)
  // handleMessage(data.text);
});


// working with API - OLD

// const getMessages = () => {
//   const TOKEN = process.env.SECURITY_TOKEN
//   axios.get(`https://slack.com/api/channels.history?token=${TOKEN}&channel=CH647QWR5`)
//   .then(res => {
//     res.data.messages.forEach((message) => {
//       if (Object.keys(message).includes("client_msg_id")) {
//         const messages_array = message.text.split(" ")
//         if (message.text.includes("valborg")) {
//           bot.postMessageToChannel('random', 'test can we post')
//         }
//       }
//     });
//   })
// }

// getMessages();

