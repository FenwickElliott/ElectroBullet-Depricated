const jsonfile = require('jsonfile');
const fetch = require('node-fetch');

const Secrets = require('./secrets');
const base_url = 'https://api.pushbullet.com/v2/';
const m = jsonfile.readFileSync('./db/threads.json');

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