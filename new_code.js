const https = require('https');
const util = require('util');
const axios = require('axios');

exports.handler = function(event, context) {
  console.log(JSON.stringify(event, null, 2));
  console.log('From SNS:', event.Records[0].Sns.Message);
  const message = event.Records[0].Sns.Message

  let channel;
  if (event.Records[0].Sns.TopicArn === 'arn:aws:sns:eu-west-1:201427539538:newMessages') {
    // so here first do if message includes a file is uploaded...
    if (message.includes("A new file is uploaded from member")) {
      const messages_array = message.split(" ")
      // example for this one A new file is uploaded from member 1067013 with type image/png. The file key is 01695210-4efe-11e9-b95f-af9d3b683c99-asset.png
      const memberIDFileUpload = messages_array[7]

      // getMessages(memberIDFileUpload, message.text)

      const TOKEN = process.env.SECURITY_TOKEN
      axios.get(`https://slack.com/api/channels.history?token=${TOKEN}&channel=CDNHV9C56&count=20`)
      .then(res => {
        res.data.messages.forEach((mess) => {
          const memberIDValborgMessage = mess.text.split(" ")[4].slice(0, -1)
          // if this is true it means that there is a match in the user_id and they have posted a message with valborg
          if (memberIDValborgMessage === memberIDFileUpload && message.text.includes("valborg")) {
            // post both valborg message and file upload message to new chat
            // mess is instance of messages that we are currently iterating over - this is the valborg message
            postMessage(mess.text)
            // message is declared above const message = event.Records[0].Sns.Message - this is the file upload message
            postMessage(message.text)
          }
        });
      });
    }
  };

  const postMessage = (message) => {
    channel = '#testing'

    const postData = {
      "channel": channel,
      "username": "Bender",
      "text": "<!channel> " + message,
      "icon_emoji": ":robot-face:"
    };

    const options = {
      method: 'POST',
      hostname: 'hooks.slack.com',
      port: 443,
      path: '/services/T5KLK1H52/B9TPKUF17/PTzs6o3rSOuUupLFCtQImfpm'
    };

    const req = https.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log('Response from slack: ', chunk)
        context.done(null);
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    req.write(util.format("%j", postData));
    req.end();

    console.log('done');
  }
}

// // this works if the valborg message is sent first
// const getMessages = (id, file_upload_message) => {
//   const TOKEN = process.env.SECURITY_TOKEN
//   axios.get(`https://slack.com/api/channels.history?token=${TOKEN}&channel=CH647QWR5&count=20`)
//   .then(res => {
//     res.data.messages.forEach((message) => {
//       // if this is true it means that there is a match in the user_id and they have posted a message with valborg
//       if (message.text.split(" ")[4].slice(0, -1) === id && message.text.includes("valborg")) {
//       // post both valborg message and file upload message to new chat
//         bot.postMessageToChannel('random', message.text)
//         bot.postMessageToChannel('random', file_upload_message)
//       }
//     });
//   })
// }
