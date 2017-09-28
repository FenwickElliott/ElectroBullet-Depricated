const fetch = require('node-fetch');
const Secrets = require('./secrets');

function send(recipient, body){
    packet = JSON.stringify({
        push: {
                conversation_iden: recipient,
                message: body,
                package_name: "com.pushbullet.android",
                source_user_iden: Secrets.iden,
                target_device_iden: Secrets.deviceIden,
                type: "messaging_extension_reply"
            },
        type: "push"
    })

    fetch("https://api.pushbullet.com/v2/ephemerals", {
        method: 'POST',
        headers: 'Content-Type: application/json',
        headers: {"Access-Token": Secrets.apiKey},
        body: packet
    })
    .then(res => res.json())
    .then(res => console.log(res));
}

send("+19173659424", 'i rule');