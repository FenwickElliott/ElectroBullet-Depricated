var jsonfile = require('jsonfile')
var file = './db/threads.json'
var magazine = document.getElementById('magazine');

var x = jsonfile.readFileSync(file)

for (var i = 0; i < 15; i++){
    magazine.innerHTML += '<h2> ' + x.threads[i].recipients[0].name + '</h2';
    magazine.innerHTML += '<p> ' + x.threads[i].latest.body + '</p>';
}