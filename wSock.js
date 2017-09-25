const Secrets = require('./secrets');
const websocket = new WebSocket('wss://stream.pushbullet.com/websocket/' + Secrets.apiKey);

websocket.onmessage = function(e){
    let data = JSON.parse(e.data);
    if (data.push.notifications) {
        data.push.notifications.forEach(function(n){
            new Notification(data.push.notifications[0].title, {
                body: data.push.notifications[0].body
            })
        })
    }
}