const jsonfile = require('jsonfile');
const fetch = require('node-fetch');

const Secrets = require('./secrets');

let currentThread;
let m;

getMagazine();

function getMagazine(){
    fetch(`https://api.pushbullet.com/v2/permanents/${Secrets.deviceIden}_threads`, {
        headers: {"Access-Token": Secrets.apiKey}
    })
    .then(res => res.json())
    .then(function(res){
        currentThread = res.threads[0];
        m = res.threads;
        postMagazine(res);
        // magazine.json is redundant at this point
        // jsonfile.writeFile('./db/magazine.json', res, err => console.log(err));
        res.threads.forEach(function(threadM){
            jsonfile.readFile(`./db/threads/thread${threadM['id']}.json`, (err, threadI) =>{
                if (err){
                    // console.log('error becasue thread json doesnt exist')
                    getThread(threadM['id'])
                }
                if (threadM.latest.id != threadI['thread'][0].id){
                    // console.log('refreshing outdated thread')
                    getThread(threadM['id'])
                }
                // console.log('threads are current')
            })
        })
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
    if (bulk.innerHTML == ''){
        loadThread(mag.threads[0].id);
    }

}

function loadThread(id){
    // console.log('loading')
    let thread = jsonfile.readFile(`./db/threads/thread${id}.json`, (err, thread) =>{
        if (err){
            getThread(id);
        }
        currentThread = m.find(x => x.id == id);
        postThread(thread);
    })
}

function getThread(id){
    fetch(`https://api.pushbullet.com/v2/permanents/${Secrets.deviceIden}_thread_${id}`, {
        headers: {"Access-Token": Secrets.apiKey}
    })
    .then(res => res.json())
    .then(function(json){
        // postThread(json)
        jsonfile.writeFile(`./db/threads/thread${id}.json`, json, err => console.log(err));
    })
}

function postThread(thread){
    bulk.innerHTML = '';
    thread.thread.forEach(function(msg){
        bulk.innerHTML = `<p class="${msg.direction}">${msg.body}</p>` + bulk.innerHTML
        // bulk.innerHTML += `<p class="${msg.direction}">${msg.body}</p>`;
    })
    bulk.scrollTop = bulk.scrollHeight;
}

const websocket = new WebSocket('wss://stream.pushbullet.com/websocket/' + Secrets.apiKey);

websocket.onmessage = function(e){
    // console.dir(e.data);
    let data = JSON.parse(e.data);
    if (data.push && data.push.notifications) {
        getMagazine();
        data.push.notifications.forEach(function(n){
            new Notification(data.push.notifications[0].title, {
                body: data.push.notifications[0].body
            })
        })
    }
}

function send(body){
    packet = JSON.stringify({
        push: {
                conversation_iden: currentThread.recipients[0].address,
                message: body,
                package_name: "com.pushbullet.android",
                source_user_iden: Secrets.iden,
                target_device_iden: Secrets.deviceIden,
                type: "messaging_extension_reply"
            },
        type: "push"
    })

    fetch("https://api.pushbullet.com/v2/ephemerals", {
        method: 'POST',
        headers: 'Content-Type: application/json',
        headers: {"Access-Token": Secrets.apiKey},
        body: packet
    })
    .then(res => res.json())
    .then(res => console.log(res));
}