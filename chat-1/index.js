const app = require('express')();
const http = require('http').createServer(app);
const port = 8080;
const io = require('socket.io')(http);
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });

  io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
    socket.on('disconnect', function(){
        io.emit('chat message', msg);
    });
  });
  });
http.listen(port, function(){
  console.log('Serveur tourne sur http://localhost:'+port);
});



// const http = require('http');
// const port = 8080;
// http.createServer(function (req, res) {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write('<h1> <em>Salut tout le monde!</em></h1>');
//     res.end();
//     }).listen(port);
//     console.log("Serveur tourne sur http://localhost:"+port);