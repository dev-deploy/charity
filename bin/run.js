'use strict';

const slackClient = require('../server/slack-client');
const service = require('../server/service');
const http = require('http');
const server = http.createServer(service);

const witToken = process.env.WIT_API_TOKEN;
const witClient = require('../server/wit-client')(witToken);

const slackToken = process.env.SLACK_API_TOKEN;
const slackLogLevel = 'verbose';

const rtm = slackClient.init(slackToken, slackLogLevel, witClient);
rtm.start();

slackClient.addAuthenticatedHandler(rtm, () => server.listen(3000))

server.on('listening', function() {

  console.log(`CHARITY is listening on ${server.address().port} in ${service.get('env')} mode.`);
});
