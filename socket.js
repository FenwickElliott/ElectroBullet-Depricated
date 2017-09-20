var websocket;
const Secrets = require('./secrets');
var switcher = document.getElementById('switcher');
var messages = document.getElementById('messages');
var status = document.getElementById('status');
var open = false;

switcher.onclick = function(){
    if (open){
        open = false;
        document.getElementById('status').innerText = 'Closed';
        console.log('closing');
    } else {
        open = true;
        document.getElementById('status').innerText = 'Open';
        console.log('opening');
    }
}