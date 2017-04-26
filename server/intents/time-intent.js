'use strict';

module.exports.process = function process(intentData, callback) {

    if (intentData.intent[0].value !== 'time')
        return callback(new Error(`Expected time intent, get ${intentData.intent[0].value}`));
    if (!intentData.location) return callback(new Error('Missing location in time intent.'));
    return callback(false, `I don't yet know the time in ${intentData.location[0].value}`);
}