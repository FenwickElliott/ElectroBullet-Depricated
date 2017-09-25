const Secrets = require('./secrets');
const websocket = new WebSocket('wss://stream.pushbullet.com/websocket/' + Secrets.apiKey);
websocket.onmessage = function(e){
    let data = JSON.parse(e.data);
    if (data.type == "nop"){
        return;
    } else if (data.type == "push") {
        alert(data);
        let myNotification = new Notification('Title', {
            body: 'Lorem Ipsum Dolor Sit Amet'
          })
    }
}