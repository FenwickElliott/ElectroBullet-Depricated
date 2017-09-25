const jsonfile = require('jsonfile');
const fetch = require('node-fetch');

const Secrets = require('./secrets');
const base_url = 'https://api.pushbullet.com/v2/';
const m = jsonfile.readFileSync('./db/threads.json');

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

// nb user must create a ./db folder
function initialize (){
    // Get user info
    get('users/me', 'user_info');
    // Get devices
    get('devices', 'devices');
    // Get catalogue of SMS threads
    get('permanents/' + Secrets.deviceIden + '_threads', 'threads');
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

function loadMagazine(){
    for (let i = 0; i < m.threads.length; i++){
        let shade;
        if ( i % 2 == 0){
            shade = 'light';
        } else {
            shade = 'dark';
        }
        magazine.innerHTML += `
            <div class="${shade}" id="conversation${i}" onclick="loadThread(${m.threads[i].id})">
                <h2> ${m.threads[i].recipients[0].name} </h2>
                <p> ${m.threads[i].latest.body} </p>
            </div>
        `
    }
}

function loadThread(id){
    getThread(id);
    bulk.innerHTML = '';
    jsonfile.readFile(`./db/threads/thread${id}.json`,function(err, obj) {
            for (let i = obj['thread'].length - 1; i >=0; i--){
            bulk.innerHTML += `<p class="${obj['thread'][i]['direction']}"X> ${obj['thread'][i]['body']} </p>`;
        }
      });
}

loadMagazine();