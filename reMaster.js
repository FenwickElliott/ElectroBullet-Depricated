const jsonfile = require('jsonfile');
const fetch = require('node-fetch');

const Secrets = require('./secrets');

loadMagazine();

function loadMagazine(){
    mag = jsonfile.readFile('./db/mag.json', (err, res) => {
        if (err){
            getMagazine();
        }
        postMagazine(res);
    })
}

function getMagazine(){
    fetch(`https://api.pushbullet.com/v2/permanents/${Secrets.deviceIden}_threads`, {
        headers: {"Access-Token": Secrets.apiKey}
    })
    .then(res => res.json())
    .then(function(res){
        postMagazine(res);
        jsonfile.writeFile('./db/mag.json', res, err => console.log(err));
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
    // console.dir(thread);
    bulk.innerHTML = '';
    thread.thread.forEach(function(msg){
        bulk.innerHTML = `<p class="${msg.direction}">${msg.body}</p>` + bulk.innerHTML
    })
}