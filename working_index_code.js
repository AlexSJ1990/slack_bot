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
    // const mess = message.text
    // console.log(mess)
    // send test messages in the correct format for this to work e.g. Ny fråga från medlem: 1067013, "valborg".
    memberIDShortMsg = messages_array[4].slice(0, -1)
    // example for this one A new file is uploaded from member 1067013 with type image/png. The file key is 01695210-4efe-11e9-b95f-af9d3b683c99-asset.png
    memberIDFileUpload = messages_array[7]
    if (message.text.includes("A new file is uploaded from member")) {
      // console.log("hey")
      getMessages(memberIDFileUpload, memberIDShortMsg, message.text)

      // this is to delete from chat
      // axios.post(`https://slack.com/api/chat.delete?token=${TOKEN}&channel=CH647QWR5&ts=${timestamp}`)
      // .then(res => {
      //   return res
      // })
    }
  }
});

// this works if the valborg message is sent first
const getMessages = (file_upload_id, short_message_id, file_upload_message) => {
  const TOKEN = process.env.SECURITY_TOKEN
  axios.get(`https://slack.com/api/channels.history?token=${TOKEN}&channel=CH647QWR5&count=20`)
  .then(res => {
    res.data.messages.forEach((message) => {
      // if this is true it means that there is a match in the user_id and they have posted a message with valborg
      if (message.text.split(" ")[4].slice(0, -1) === file_upload_id && message.text.includes("valborg")) {
      // post both valborg message and file upload message to new chat
        bot.postMessageToChannel('random', message.text)
        bot.postMessageToChannel('random', file_upload_message)
      }
    });
  })
}

// error handler
bot.on('error', (err) => console.log(err));

// message handler
bot.on('message', data => {
  if (data.type !== 'message') {
    return;
  }
  console.log(data.text)
});
