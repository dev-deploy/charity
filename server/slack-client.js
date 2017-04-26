'use strict';

const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
let rtm = null;
let nlp = null;

function handleOnAuthenticated(rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}

function addAuthenticatedHandler(rtm, handler) {
  rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler);
}

function handleOnMessage(message) {
  //console.log(message);

  if(message.text.toLowerCase().includes('charity')) {

    nlp.ask(message.text, (err, res) => {
      if (err) {
        console.log(err);
        return;
      }

      try {
        if (!res.intent || !res.intent[0] || !res.intent[0].value) {
          throw new Error("Could not extract intent");
        }

        const intent = require('./intents/' + res.intent[0].value + '-intent');
        intent.process(res, function(err, response) {
          if (err) {
            console.log(err.message);
            return
          }

          return rtm.sendMessage(response, message.channel);
        });

      } catch(err) {
          console.log(err);
          console.log(response);
          rtm.sendMessage("Sorry, I don't know that you are talking about!", message.channel);
      }

      if (!res.intent[0].value) {
        return rtm.sendMessage('Sorry, I do not understand the question.', message.channel, function messageSent() {
        });
      } else if (res.intent[0].value == 'time' && res.location) {
        return rtm.sendMessage(`I dont't yet know the time in ${res.location[0].value}`, message.channel, function messageSent() {
        });
      } else {
        console.log('Else clause: ' + res);
        return rtm.sendMessage('Sorry, I do not understand the question.', message.channel, function messageSent() {
        });
      }

      rtm.sendMessage('Hello, my friend!', message.channel, function messageSent() {
      });
    });

  } // end if

}

module.exports.init = function slackClient(token, loglevel, nlpClient) {
  rtm = new RtmClient(token, {logLevel: loglevel});
  nlp = nlpClient;
  addAuthenticatedHandler(rtm, handleOnAuthenticated);
  rtm.on(RTM_EVENTS.MESSAGE, handleOnMessage);
  return rtm;
};

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;
