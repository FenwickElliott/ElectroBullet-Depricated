const jsonfile = require('jsonfile');
const fetch = require('node-fetch');

const Secrets = require('./secrets');

getMagazine();

function getMagazine(){
    fetch(`https://api.pushbullet.com/v2/permanents/${Secrets.deviceIden}_threads`, {
        headers: {"Access-Token": Secrets.apiKey}
    })
    .then(res => res.json())
    .then(function(res){
        postMagazine(res);
        jsonfile.writeFile('./db/magazine.json', res, err => console.log(err));
    });
}

function postMagazine(mag){
    magazine.innerHTML = '';
    for (let i = 0; i < mag.threads.length; i++){
        let shade;
        if ( i % 2 == 0){
            shade = 'light';
        } else {
            shade = 'dark';
        }
        magazine.innerHTML += `
            <div class="${shade}" id="conversation${i}" onclick="loadThread(${mag.threads[i].id})">
                <h2> ${mag.threads[i].recipients[0].name} </h2>
                <p> ${mag.threads[i].latest.body} </p>
            </div>
        `
    }
    loadThread(mag.threads[0].id);
}

function loadThread(id){
    let thread = jsonfile.readFile(`./db/threads/thread${id}.json`, (err, thread) =>{
        if (err){
            getThread(id);
        }
        postThread(thread);
    })
}

function getThread(id){
    fetch(`https://api.pushbullet.com/v2/permanents/${Secrets.deviceIden}_thread_${id}`, {
        headers: {"Access-Token": Secrets.apiKey}
    })
    .then(res => res.json())
    .then(function(json){
        postThread(json)
        jsonfile.writeFile(`./db/threads/thread${id}.json`, json, err => console.log(err));
    })
}

function postThread(thread){
    bulk.innerHTML = '';
    thread.thread.forEach(function(msg){
        // bulk.innerHTML = `<p class="${msg.direction}">${msg.body}</p>` + bulk.innerHTML
        bulk.innerHTML += `<p class="${msg.direction}">${msg.body}</p>`;
    })
}

const websocket = new WebSocket('wss://stream.pushbullet.com/websocket/' + Secrets.apiKey);

websocket.onmessage = function(e){
    console.dir(e.data);
    let data = JSON.parse(e.data);
    if (data.push && data.push.notifications) {
        data.push.notifications.forEach(function(n){
            new Notification(data.push.notifications[0].title, {
                body: data.push.notifications[0].body
            })
        })
    }
}