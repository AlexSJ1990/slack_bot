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
  const channel = "CH647QWR5"
  const timestamp = message.ts
  const TOKEN = process.env.BOT_TOKEN
  if ((Object.keys(message).includes("client_msg_id")) && (Object.keys(message.channel === channel))) {
    const messages_array = message.text.split(" ")
    const mess = message.text
    if (message.text.includes("valborg")) {
      bot.postMessageToChannel('random', mess)
      axios.post(`https://slack.com/api/chat.delete?token=${TOKEN}&channel=CH647QWR5&ts=${timestamp}`)
      .then(res => {
        return res
      })
    }
  }
});

// error handler
bot.on('error', (err) => console.log(err));

// message handler
bot.on('message', data => {
  if (data.type !== 'message') {
    return;
  }
  console.log(data.text)
});
