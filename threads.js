var jsonfile = require('jsonfile');
var magazine = document.getElementById('magazine');

var x = jsonfile.readFileSync('./db/threads.json')

for (var i = 0; i < 15; i++){
    let shade;
    if ( i % 2 == 0){
        shade = 'light';
    } else {
        shade = 'dark';
    }
    magazine.innerHTML += `
        <div class="${shade}" id="conversation${i}">
            <h2> ${x.threads[i].recipients[0].name} </h2>
            <p> ${x.threads[i].latest.body} </p>
        </div>
    `
}