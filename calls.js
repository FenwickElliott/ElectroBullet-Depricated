const Secrets = require('./secrets')
const base_url = 'https://api.pushbullet.com/v2/';
const jsonfile = require('jsonfile')
const fetch = require('node-fetch');

function get (endpoint, target){
    fetch(base_url + endpoint, {
        headers: {"Access-Token": Secrets.apiKey}
    })
    .then(res => res.json())
    .then(function(json){
        jsonfile.writeFile('./db/'+ target +'.json', json, err => console.log(err));
        return;
    });
}

function getThread (id) {
    fetch('https://api.pushbullet.com/v2/permanents/' + Secrets.deviceIden + '_thread_' + id, {
        headers: {"Access-Token": Secrets.apiKey}
    })
    .then(res => res.json())
    .then(function(json){
        jsonfile.writeFile('./db/threads/thread'+ id +'.json', json, err => console.log(err));
        return;
    });
}

// nb user must create a ./db folder
function initialize (){
    // Get all SMS threads
    get('permanents/' + Secrets.deviceIden + '_threads', 'threads');

    // Get user info
    get('users/me', 'user_info');

    // Get devices
    get('devices', 'devices');
}

initialize();

module.exports.get = get;
module.exports.getThread = getThread;
module.exports.initialize = initialize;