const jsonfile = require('jsonfile');
const fetch = require('node-fetch');
const fs = require('fs');

const Secrets = require('./secrets');
const base_url = 'https://api.pushbullet.com/v2/';
// need to manage loading of m
initialize();
const m = jsonfile.readFileSync('./db/threads.json');
// const m = fs.readFileSync('./db/threads.json');


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

function memLoadThread(id){
    fetch('https://api.pushbullet.com/v2/permanents/' + Secrets.deviceIden + '_thread_' + id, {
        headers: {"Access-Token": Secrets.apiKey}
    })
    .then(res => res.json())
    .then(function(json){
        bulk.innerHTML = '';
        json.thread.forEach(function(msg){
            bulk.innerHTML = `<p class="${msg.direction}">${msg.body}</p>` + bulk.innerHTML
        })
    })
}

// function loadThread(id){
//     try {
//         let t = fs.readFileSync(`./db/thread${id}.json`);
//         console.log(`thread ${id} found!`);
//         console.dir(t);
//     } catch (e) {
//         getThread(id);
//         console.log('getting');
//     }
// }

function loadThread(id){
    jsonfile.readFile(`./db/threads/thread${id}.json`, function(err, thread){
        if(err){
            // console.log(err);
            return getThread(id);
        }
        console.dir(thread);
        bulk.innerHTML = '';
        thread.thread.forEach(function(msg){
            bulk.innerHTML = `<p class="${msg.direction}">${msg.body}</p>` + bulk.innerHTML
        })
    });
}

function getThread(id){
    // console.log(`getting ${id}`);
    get(`permanents/${Secrets.deviceIden}/_thread_${id}`, `threads/thread${id}`);
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

loadMagazine();

const websocket = new WebSocket('wss://stream.pushbullet.com/websocket/' + Secrets.apiKey);

websocket.onmessage = function(e){
    let data = JSON.parse(e.data);
    if (data.push && data.push.notifications) {
        data.push.notifications.forEach(function(n){
            new Notification(data.push.notifications[0].title, {
                body: data.push.notifications[0].body
            })
        })
    }
}