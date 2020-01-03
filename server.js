let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let port = process.env.PORT || 8080;
let lastMessage = new Array();

server.listen(port);

app.use(express.static(__dirname + '/Public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Public/index.html');
});

io.on('connection', function(client){
    client.emit('last message', lastMessage);

    client.on('new message', function(data){
        io.emit('new message', data);
        // Vérification du pseudonyme
if(!data.username || typeof data.username == undefined || data.username.length > 25){
    client.emit('error message', "Le pseudonyme rentré n'est pas valide !");
    return;
}

// Vérification du message
if(!data.message || typeof data.message == undefined || data.message.length > 255){
    client.emit('error message', "Le message rentré n'est pas valide !");
    return;
}
lastMessage.push(data.username + ' : ' + data.message);
for(var i = lastMessage.length-1; i--;){
    if(i == 4){
        lastMessage.shift();
    }
}
    });

    client.on('disconnect', function(){
        delete client;
    });

});
