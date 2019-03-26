  const https = require('https');
  const util = require('util');

  exports.handler = function(event, context) {
    console.log(JSON.stringify(event, null, 2));
    console.log('From SNS:', event.Records[0].Sns.Message);
    const message = event.Records[0].Sns.Message

    let channel;
    if (event.Records[0].Sns.TopicArn === 'arn:aws:sns:eu-west-1:201427539538:newMessages') {
      if ((message.includes("valborg")) || (message.includes("A new file is uploaded from member"))) {

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
  };
