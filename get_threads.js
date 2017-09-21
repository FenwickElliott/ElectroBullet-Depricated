var jsonfile = require('jsonfile')
var file = './db/threads.json'

var x = jsonfile.readFileSync(file)

for (var i = 0; i < 15; i++){
    console.log(x.threads[i].recipients[0].name);
    console.log(x.threads[i].latest.body);
}