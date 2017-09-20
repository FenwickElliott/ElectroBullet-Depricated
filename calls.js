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
        console.log(json);
        jsonfile.writeFile('./db/'+ target +'.json', json, err => console.log(err));
        return;
    });
}

// Get all SMS threads
get('permanents/' + Secrets.deviceIden + '_threads', 'threads');

// Get user info
get('users/me', 'user_info');

// Get devices
get('devices', 'devices');