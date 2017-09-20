var websocket;
const Secrets = require('./secrets');
var switcher = document.getElementById('switcher');
var messages = document.getElementById('messages');
var status = document.getElementById('status');
var open = false;

function openSocket (){
    websocket = new WebSocket('wss://stream.pushbullet.com/websocket/' + Secrets.apiKey);
    websocket.onmessage = function(e){
        messages.innerHTML += "<p>" + e.data + "</p>";
    }
}

switcher.onclick = function(){
    if (open){
        websocket.close();
        open = false;
        document.getElementById('status').innerText = 'Closed';
        console.log('closing');
    } else {
        openSocket();
        open = true;
        document.getElementById('status').innerText = 'Open';
        console.log('opening');
    }
}