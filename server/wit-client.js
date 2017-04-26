'use strict';

const request = require('superagent');

function handleWitResponse(res) {
    //console.log(res);
    return res.entities;
}

module.exports = function witClient(token) {
    const ask = function ask(message, callback) {

        request.get('https://api.wit.ai/message')
            .set('Authorization', 'Bearer ' + token)
            .query({v: '20170425'})
            .query({q: message})
            .end((err, res) => {
                if (err) return callback(err);
                if(res.statusCode != 200) return callback('Expected status 200 but get ' + res.statusCode);
                const witResponse = handleWitResponse(res.body);
                return callback(null, witResponse);
            })


        // console.log('ask: ' + message);
        // console.log('token: ' + token);
    }

    return {
        ask: ask
    }
}