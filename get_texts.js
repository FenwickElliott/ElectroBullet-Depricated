const Secrets = require('./secrets')
const base_url = 'https://api.pushbullet.com/';
const jsonfile = require('jsonfile')
const fetch = require('node-fetch');


function get (endpoint, target){
    console.log(base_url + endpoint);
    target = './'+ target +'.json';
    console.log(target);
    fetch(base_url + endpoint, {
        headers: {"Access-Token": Secrets.apiKey}
    })
    .then(res => res.json())
    .then(function(json){
        console.log(json);
        jsonfile.writeFile(target, json, err => console.log(err));
        return;
    });
}

get('/v2/permanents/' + Secrets.deviceIden + '_threads', 'perms')