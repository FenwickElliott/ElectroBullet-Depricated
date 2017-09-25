const jsonfile = require('jsonfile');
const Calls = require('./calls');
var magazine = document.getElementById('magazine');
var bulk = document.getElementById('bulk');

var x = jsonfile.readFileSync('./db/threads.json');

function loadThread(id){
    Calls.getThread(id);
    bulk.innerHTML = '';
    jsonfile.readFile(`./db/threads/thread${id}.json`,function(err, obj) {
        // for (let i = 0; i < obj['thread'].length; i++){
            for (let i = obj['thread'].length - 1; i >=0; i--){
            bulk.innerHTML += `<p class="${obj['thread'][i]['direction']}"X> ${obj['thread'][i]['body']} </p>`;
        }
      });
}

function loadMagazine(){
    for (let i = 0; i < 15; i++){
        let shade;
        if ( i % 2 == 0){
            shade = 'light';
        } else {
            shade = 'dark';
        }
        magazine.innerHTML += `
            <div class="${shade}" id="conversation${i}" onclick="loadThread(${x.threads[i].id})">
                <h2> ${x.threads[i].recipients[0].name} </h2>
                <p> ${x.threads[i].latest.body} </p>
            </div>
        `
    }
}

loadMagazine();
